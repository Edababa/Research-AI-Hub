
import { GoogleGenAI, Type } from "@google/genai";
import { Course, User } from "../types";

/**
 * Gets personalized course recommendations based on user profile.
 */
export const getAIRecommendations = async (user: User, allCourses: Course[]) => {
  // Use process.env.API_KEY directly. The shim in index.html ensures 'process' exists.
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Based on this researcher's profile:
    Name: ${user.name}
    Interests: ${user.interests.join(', ')}
    Learning History: ${JSON.stringify(user.history)}

    And available courses:
    ${JSON.stringify(allCourses.map(c => ({ id: c.id, title: c.title, cat: c.category })))}

    Please recommend the top 2 courses for this user. 
    Explain briefly why in a helpful, encouraging tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              courseId: {
                type: Type.STRING,
                description: 'The ID of the recommended course.',
              },
              reason: {
                type: Type.STRING,
                description: 'The reason why this course is recommended for the user.',
              },
            },
            propertyOrdering: ["courseId", "reason"],
            required: ["courseId", "reason"],
          },
        },
      },
    });
    
    const text = response.text;
    return JSON.parse(text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

/**
 * Generates a motivational nudge message for a user.
 */
export const generateReminderMessage = async (user: User, pendingCourse: Course) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return `Hi ${user.name}, don't forget to check back on ${pendingCourse.title}!`;

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    The researcher ${user.name} has the course "${pendingCourse.title}" marked as "in-progress" or "not-started".
    Write a short, professional, yet motivating reminder "nudge" for them to continue their learning journey. 
    Keep it under 30 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || `Hi ${user.name}, don't forget to check back on ${pendingCourse.title}!`;
  } catch (error) {
    return `Hi ${user.name}, don't forget to check back on ${pendingCourse.title} when you have a moment!`;
  }
};
