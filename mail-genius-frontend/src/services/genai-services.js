import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = "gemini-2.0-flash-001";

export async function generateContent(formData) {

    const systemInstructions = {
        text: `You are an expert email composition assistant designed to generate professional, contextually appropriate emails based on user parameters. Your goal is to create emails that are clear, actionable, and perfectly matched to the specified tone and context.

CORE PRINCIPLES:
- Generate complete, ready-to-send emails
- Match the exact tone requested (professional, casual, friendly, urgent, etc.)
- Incorporate all provided context and data naturally
- Ensure appropriate email structure (greeting, body, closing)
- Adapt creativity level from templated (low) to highly personalized (high)
- Always include a clear subject line
- Make emails actionable and purposeful

TONE GUIDELINES:
- Professional: Formal language, clear structure, business-appropriate
- Casual: Relaxed tone, conversational language, friendly approach
- Friendly: Warm, personal, approachable while maintaining respect
- Urgent: Direct, time-sensitive language, clear call-to-action
- Formal: Very structured, traditional business language, respectful
- Persuasive: Compelling arguments, benefit-focused, action-oriented

Email Structure REQUIREMENTS:
- Always provide a subject line
- Include proper email greeting and closing
- Ensure professional formatting
- Make content scannable with paragraphs/bullet points when appropriate`
    };

    // const response_schema = {
    //     "type": "OBJECT", "properties": {
    //         "subject": { "type": "STRING", "description": "A concise and relevant subject line for the email." },
    //         "body": { "type": "STRING", "description": "The full content of the email, formatted with appropriate line breaks and spacing." },
    //         "metadata": { "type": "OBJECT", "description": "Additional data about the generated email.", "properties": { "tone_applied": { "type": "STRING", "description": "The primary tone used to write the email." }, "estimated_read_time": { "type": "INTEGER", "description": "The estimated time in seconds to read the email body." }, "key_points": { "type": "ARRAY", "description": "A list of the main points or takeaways from the email.", "items": { "type": "STRING" } } }, "required": ["tone_applied", "creativity_level", "word_count", "estimated_read_time", "key_points"] }
    //     }, "required": ["subject", "body", "metadata"]
    // }

    // Set up generation config
    const generationConfig = {
        maxOutputTokens: 47312,
        topP: 0.4,
        safetySettings: [
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
            },
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
            }
        ],
        response_mime_type: "application/text",
        // response_schema: response_schema,
        systemInstruction: {
            parts: [systemInstructions]
        },
    };

    const userPrompt = `Generate a email based on the following parameters:

**EMAIL PARAMETERS:**
- Subject: ${formData.subject}
- Context: ${formData.context || '-'}
- Additional Data: ${formData.data || '-'}
- Tone: ${formData.tone}

**INSTRUCTIONS:**
1. Create a complete email that addresses the subject and incorporates all provided context and additional data.
2. Apply the specified tone consistently throughout the email.
3. Ensure the email has a clear purpose and appropriate call-to-action if applicable.
4. Format for easy reading with proper paragraphs and structure.
5. Include relevant data points naturally within the email content

Generate the email now:`;

    const req = {
        model: model,
        contents: [
            { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
            ...generationConfig,
            temperature: formData.creativity / 50,
        },
    };

    try {
        const result = await ai.models.generateContent(req);
        return result.text;
    } catch (error) {
        console.error("Error generating content from AI:", error);
        throw error;
    }
}
