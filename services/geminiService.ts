
import { GoogleGenAI } from "@google/genai";
import { Course, User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendations = async (user: User, allCourses: Course[]) => {
  const prompt = `
    Based on this researcher's profile:
    Name: ${user.name}
    Interests: ${user.interests.join(', ')}
    Learning History: ${JSON.stringify(user.history)}

    And available courses:
    ${JSON.stringify(allCourses.map(c => ({ id: c.id, title: c.title, cat: c.category })))}

    Please recommend the top 2 courses for this user. 
    Explain briefly why in a helpful, encouraging tone.
    Return a valid JSON array of objects like: [{"courseId": "1", "reason": "..."}]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const generateReminderMessage = async (user: User, pendingCourse: Course) => {
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
    return response.text;
  } catch (error) {
    return `Hi ${user.name}, don't forget to check back on ${pendingCourse.title} when you have a moment!`;
  }
};
