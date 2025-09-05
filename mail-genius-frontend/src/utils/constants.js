export const EMAIL_GENERATOR = {
    TITLE: 'Generate Email',
    DESCRIPTION: 'Fill in the details below to generate your email content.',
    OUTPUT_TITLE: 'Email Output',
    BUTTON_TEXT: 'Generate Email Content',

    PLACEHOLDERS: {
        SUBJECT: "e.g., 'Meeting Follow-Up' or 'Project Update'",
        CONTEXT: "Provide some context for the email. E.g., 'Following up on our call yesterday regarding the Q3 report...'",
        DATA: "Include any specific data points, questions, or action items.",
    },

    LABELS: {
        SUBJECT: 'Subject',
        CONTEXT: 'Context',
        DATA: 'Data',
        TONE: 'Tone',
        CREATIVITY: 'Creativity'
    },

    TONE_OPTIONS: [
        { value: 'Professional', label: 'Professional' },
        { value: 'Casual', label: 'Casual' },
        { value: 'Friendly', label: 'Friendly' },
        { value: 'Formal', label: 'Formal' },
        { value: 'Urgent', label: 'Urgent' },
        { value: 'Persuasive', label: 'Persuasive' },
        { value: 'Apologetic', label: 'Apologetic' },
        { value: 'Congratulatory', label: 'Congratulatory' },
    ],

    CREATIVITY_LABELS: {
        LESS: 'Less Creative',
        MORE: 'More Creative',
    },

    BUTTONS: {
        COPY: '📋',
        EDIT: '✏️',
    },
};

export const geminiModel = "gemini-2.0-flash-001";