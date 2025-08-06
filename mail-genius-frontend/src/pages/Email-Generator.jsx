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
        <div className="email-generator-container mt-4 mb-4 flex justify-evenly">
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
                                    <Textarea
                                        id="context"
                                        name="context"
                                        placeholder={EMAIL_GENERATOR.PLACEHOLDERS.CONTEXT}
                                        value={formData.context}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="data">{EMAIL_GENERATOR.LABELS.DATA}</Label>
                                    <Textarea
                                        id="data"
                                        name="data"
                                        placeholder={EMAIL_GENERATOR.PLACEHOLDERS.DATA}
                                        value={formData.data}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
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

                        <div className="space-y-4">
                            <Label htmlFor="creativity">{EMAIL_GENERATOR.LABELS.CREATIVITY}</Label>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{EMAIL_GENERATOR.CREATIVITY_LABELS.LESS}</span>
                                <Slider
                                    id="creativity"
                                    name="creativity"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[formData.creativity]}
                                    onValueChange={([value]) => handleInputChange({ target: { name: 'creativity', value } })}
                                    className="w-[60%]"
                                />
                                <span className="text-sm text-muted-foreground">{EMAIL_GENERATOR.CREATIVITY_LABELS.MORE}</span>
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
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
                        <pre>{generatedEmail}</pre>
                    </div>
                </CardContent>
                <CardFooter className="output-actions">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        {EMAIL_GENERATOR.BUTTONS.COPY}</Button>
                    <Button variant="outline" size="sm">
                        {EMAIL_GENERATOR.BUTTONS.EDIT}</Button>
                </CardFooter>
            </Card>
        </div >
    );
}

export default EmailGenerator;