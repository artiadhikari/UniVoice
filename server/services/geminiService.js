
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeComplaint = async (transcript, language, previousData = null) => {
  const prompt = `
You are UniVoice, an intelligent university hostel grievance assistant.

Analyze the student's spoken complaint.

Original language: ${language}
Student's complaint: "${transcript}"

Previous complaint information:
${JSON.stringify(previousData || {}, null, 2)}

IMPORTANT:
- Treat the previous complaint information as existing context.
- The new transcript may contain answers to previous follow-up questions.
- Merge new answers with previously extracted information.
- Never overwrite an existing value with null or an empty value.
- Re-evaluate missing_fields using both previous and new information.
- Preserve the original complaint description and update it only when
  the student provides relevant corrections or additional details.

Your job is to extract complaint information and identify essential missing details.

EXTRACT THESE FIELDS:

1. category:
   Electricity, Water, Cleaning, Internet, Maintenance, Security, or Other.

2. description:
   A clear and complete description of the actual problem in English.

3. hostel:
   Hostel name, or null if not provided.

4. room_number:
   Room number, or null if not provided.

5. location_details:
   Any additional location such as floor, corridor, bathroom,
   common area, or building. Use null if unavailable.

6. priority:
   Low, Medium, or High.
   High for emergencies, safety risks, or serious hazards.

7. urgency_reason:
   Brief explanation for the selected priority.

MISSING INFORMATION RULES:

- Identify information that is essential to understand and process
  this particular complaint.
- Do not ask for information already provided.
- Do not ask irrelevant questions.
- For hostel-specific complaints, hostel and a precise location
  (room, floor, or common area) are generally essential.
- The complaint description must clearly explain the problem.
- Ask about immediate danger if the complaint suggests a possible
  safety emergency and the situation is unclear.
- Do not ask for student name or student ID. These come from
  the student's profile.
- Do not invent or assume any missing information.
- Optional details should not be included in missing_fields.

FOLLOW-UP RULES:

- Put the missing essential field names in missing_fields.
- If information is missing, generate ONE short, natural follow_up_question.
- Ask for multiple related missing details together when appropriate.
- If nothing essential is missing, set follow_up_question to null.
- Ask the question in the student's original language when possible.

RETURN ONLY VALID JSON in this exact structure:

{
  "category": "",
  "description": "",
  "hostel": null,
  "room_number": null,
  "location_details": null,
  "priority": "Medium",
  "urgency_reason": "",
  "missing_fields": [],
  "follow_up_question": null
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const result = response.text
    .replace(/```json|```/g, "")
    .trim();

  return JSON.parse(result);
};

module.exports = { analyzeComplaint };
