import React, { useState } from 'react';
import '@/styles/email-generator.scss';
import { EMAIL_GENERATOR } from '@/utils/constants';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const EmailGenerator = () => {
    const [formData, setFormData] = useState({
        subject: '',
        context: '',
        data: '',
        tone: 'Professional',
        creativity: 50,
        showAdvanced: false
    });

    const [generatedEmail, setGeneratedEmail] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement API call for email generation
        setGeneratedEmail('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEmail);
    };

    // TODO: use shadcn Form and add field validation

    return (
        <div className="email-generator-container mt-4 mb-4">
            <Card className="input-section">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle>{EMAIL_GENERATOR.TITLE}</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="show-advanced"
                                checked={formData.showAdvanced}
                                onCheckedChange={(checked) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        showAdvanced: checked,
                                    }));
                                }}
                            />
                            <Label htmlFor="show-advanced">Advanced Options</Label>
                        </div>
                    </div>
                    <CardDescription>{EMAIL_GENERATOR.DESCRIPTION}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">{EMAIL_GENERATOR.LABELS.SUBJECT}</Label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder={EMAIL_GENERATOR.PLACEHOLDERS.SUBJECT}
                                value={formData.subject}
                                onChange={handleInputChange}
                            />
                        </div>

                        {formData.showAdvanced && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="context">{EMAIL_GENERATOR.LABELS.CONTEXT}</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="context"
                                            name="context"
                                            placeholder={EMAIL_GENERATOR.PLACEHOLDERS.CONTEXT}
                                            value={formData.context}
                                            onChange={handleInputChange}
                                            maxLength={300}
                                            className={`resize-none min-h-[6rem] ${formData.context.length > 250 ? 'border-yellow-500' : ''
                                                } ${formData.context.length >= 300 ? 'border-red-500' : ''}`}
                                        />
                                        <div className={`absolute bottom-2 right-2 text-xs pointer-events-none ${formData.context.length >= 300
                                            ? 'text-red-500'
                                            : formData.context.length > 250
                                                ? 'text-yellow-500'
                                                : 'text-muted-foreground'
                                            }`}>
                                            {formData.context.length}/300
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="data">{EMAIL_GENERATOR.LABELS.DATA}</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="data"
                                            name="data"
                                            placeholder={EMAIL_GENERATOR.PLACEHOLDERS.DATA}
                                            value={formData.data}
                                            onChange={handleInputChange}
                                            maxLength={200}
                                            className={`resize-none min-h-[6rem] ${formData.data.length > 150 ? 'border-yellow-500' : ''
                                                } ${formData.data.length >= 200 ? 'border-red-500' : ''}`}
                                        />
                                        <div className={`absolute bottom-2 right-2 text-xs pointer-events-none ${formData.data.length >= 200
                                            ? 'text-red-500'
                                            : formData.data.length > 150
                                                ? 'text-yellow-500'
                                                : 'text-muted-foreground'
                                            }`}>
                                            {formData.data.length}/200
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 w-full">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="tone">{EMAIL_GENERATOR.LABELS.TONE}</Label>
                                <Select
                                    name="tone"
                                    value={formData.tone}
                                    onValueChange={(value) => handleInputChange({ target: { name: 'tone', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EMAIL_GENERATOR.TONE_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label htmlFor="creativity">{EMAIL_GENERATOR.LABELS.CREATIVITY}</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                                        <span>{EMAIL_GENERATOR.CREATIVITY_LABELS.LESS}</span>
                                        <span>{EMAIL_GENERATOR.CREATIVITY_LABELS.MORE}</span>
                                    </div>
                                    <Slider
                                        id="creativity"
                                        name="creativity"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[formData.creativity]}
                                        onValueChange={([value]) => handleInputChange({ target: { name: 'creativity', value } })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="generate-button">
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                            </svg>
                            {EMAIL_GENERATOR.BUTTON_TEXT}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="output-section">
                <CardHeader>
                    <CardTitle>{EMAIL_GENERATOR.OUTPUT_TITLE}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="email-output">
                        <pre>{generatedEmail || 'Your generated email will appear here...'}</pre>
                    </div>
                </CardContent>
                <CardFooter className="output-actions">
                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!generatedEmail}>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                        Copy
                    </Button>
                    <Button variant="outline" size="sm" disabled={!generatedEmail}>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Edit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default EmailGenerator;