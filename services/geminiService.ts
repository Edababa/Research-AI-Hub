import { GoogleGenAI, Type } from "@google/genai";
import { Course, User } from "../types";

export const getAIRecommendations = async (user: User, allCourses: Course[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];
  
  // Use the correct initialization pattern
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Researcher Name: ${user.name}
    Interests: ${user.interests.join(", ")}
    Completed Courses: ${user.history.filter(h => h.status === 'fully-completed').length}
    Available Courses: ${JSON.stringify(allCourses.map(c => ({ id: c.id, title: c.title, category: c.category, level: c.level })))}
    
    Recommend 2 courses that best fit this researcher's profile. Explain why in a professional, motivating tone. 
    Return JSON only.
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
              courseId: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["courseId", "reason"]
          }
        }
      }
    });
    // Access the property .text directly
    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (e) {
    console.error("AI Recommendation Error:", e);
    return [];
  }
};

export const getAINudge = async (user: User, course: Course) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return `Hi ${user.name}, don't forget to check back on ${course.title}!`;
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Write a short, motivating 15-word nudge for a researcher named ${user.name} to continue their "${course.title}" course which is currently in-progress.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "Ready to continue your learning journey?";
  } catch (e) {
    return "Let's push the boundaries of AI together. Ready to resume?";
  }
};