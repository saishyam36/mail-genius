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
        presence_penalty: 0.5,
        frequency_penalty: 0.3,
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

    // Use these parameters later
    // - Additional Context: ${formData.additionalContext || 'None'}
    // - Key Points to Address: ${formData.keyPoints || 'Address all points from original message'}
    // - Sender Relationship: ${formData.senderRelationship || 'Professional colleague'}
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

export async function generateReply(previousMessage, replyContext = {}) {
    const systemInstructions = {
        text: `You are an expert email reply assistant designed to generate appropriate responses to incoming emails. Your goal is to create contextually relevant, professional replies that address the sender's points effectively.

CORE PRINCIPLES:
- Analyze the previous message thoroughly to understand intent and key points
- Generate appropriate responses that address all important elements
- Match the tone and formality level of the original message
- Ensure replies are concise yet comprehensive
- Include proper email etiquette and structure
- Provide actionable responses when appropriate

REPLY GUIDELINES:
- Acknowledge receipt and key points from the original message
- Address questions or requests directly
- Provide necessary information or next steps
- Match the sender's communication style and tone
- Keep responses focused and relevant
- Include appropriate closing remarks

Email Structure REQUIREMENTS:
- Include proper email greeting appropriate to relationship level
- Don't Add subject line in reply
- Structure content logically with clear paragraphs
- End with professional closing
- Ensure all important points from original message are addressed`
    };

    const generationConfig = {
        temperature: 0.3,
        maxOutputTokens: 36000,
        topP: 0.4,
        seed: 2,
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
        systemInstruction: {
            parts: [systemInstructions]
        },
    };

    const userPrompt = `Generate a reply to the following email message:

**PREVIOUS MESSAGE:**
${previousMessage}

**REPLY CONTEXT:**
- Urgency Level: ${replyContext?.urgency || 'Normal'}
- Relationship: ${replyContext?.senderRelationship || 'Professional'}
- To: ${replyContext?.senderName || 'Valued Contact'}
- From: ${replyContext?.receiverName || 'Name'}

**INSTRUCTIONS:**
1. Carefully analyze the previous message to understand the sender's intent, questions, and key points
2. Generate a complete reply that addresses all important elements from the original message
3. Match the appropriate tone and formality level based on the previous message tone
4. Include relevant information and next steps if applicable
5. Ensure the reply is helpful, clear, and actionable
6. Format the reply properly with a greeting, body, and closing. Do not include a subject line.

**REPLY:**`;

    const req = {
        model: model,
        contents: [
            { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig,
    };

    try {
        const result = await ai.models.generateContent(req);
        return result.text;
    } catch (error) {
        console.error("Error generating reply from AI:", error);
        throw error;
    }
}

export async function refineEmailGrammar(emailContent, senderName = '', receiverName = '') {
    const systemInstructions = {
        text: `You are an expert grammar and style editor specialized in email communication. Your goal is to improve the grammatical accuracy, clarity, and flow of emails while preserving the original meaning, tone, and intent completely.

CORE PRINCIPLES:
- NEVER change the meaning or intent of the original message
- Preserve the original tone and style as much as possible
- Fix grammatical errors, typos, and awkward phrasing
- Improve sentence structure and flow for better readability
- Maintain the same level of formality
- Keep all original key points and information intact
- Preserve the email structure (subject, greeting, body, closing)

EDITING GUIDELINES:
- Fix spelling, punctuation, and grammatical errors
- Improve sentence structure without changing meaning
- Enhance clarity and readability
- Correct verb tenses and agreement issues
- Fix awkward phrasing while maintaining voice
- Improve transitions between sentences/paragraphs
- Ensure consistent style throughout

WHAT NOT TO CHANGE:
- Core message content or meaning
- Specific data, numbers, dates, or facts
- The sender's intended tone or style
- Key terminology or technical terms
- Call-to-actions or requests
- Email structure or format decisions`
    };

    const generationConfig = {
        maxOutputTokens: 47312,
        topP: 0.2,
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
        systemInstruction: {
            parts: [systemInstructions]
        },
        temperature: 0.1, // Very low temperature for consistent, conservative edits
    };

    const userPrompt = `You are an AI email refiner. Your only job is to correct the grammar and improve the clarity of the text provided to you:

**EMAIL DETAILS:**
To: ${senderName}
From: ${receiverName}

**EMAIL TO REFINE:**
${emailContent}

**INSTRUCTIONS:**
1.  Correct all grammar, spelling, and punctuation errors.
2.  Maintain the original meaning, tone, and all factual information.
3.  If a salutation or signature of email is missing, add a standard one.
4. Maintain the original tone and style
5. Keep all factual information, data, and key points exactly the same
6. Preserve the email's structure and format
7. **Your output must ONLY be the refined email text.** Do not add any introductory phrases,subject lines, headings, or explanations.

**REFINED EMAIL:**`;

    const req = {
        model: model,
        contents: [
            { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig,
    };

    try {
        const result = await ai.models.generateContent(req);
        console.log('Refined Email Content:', result.text);
        return result.text;
    } catch (error) {
        console.error("Error refining email grammar from AI:", error);
        throw error;
    }
}
