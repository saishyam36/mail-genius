import React, { useContext, useState, useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { EmailAiContext } from '@/contexts/EmailAiContext'; // Import the AI context

const formSchema = z.object({
    subject: z.string().max(70, { message: "Subject cannot exceed 70 characters." }).min(1, { message: "Subject is required." }),
    context: z.string().max(300, { message: "Context cannot exceed 300 characters." }).optional(),
    data: z.string().max(200, { message: "Data cannot exceed 200 characters." }).optional(),
    tone: z.string().min(1, { message: "Tone is required." }),
    creativity: z.number().min(0).max(100),
    showAdvanced: z.boolean(),
});

const EmailGenerator = () => {
    const { generateEmailContent, aiResponse, isLoading, error } = useContext(EmailAiContext);
    const [generatedEmail, setGeneratedEmail] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: '',
            context: '',
            data: '',
            tone: 'Professional',
            creativity: 50,
            showAdvanced: false,
        },
    });

    const { watch, setValue } = form;
    const showAdvanced = watch('showAdvanced');
    const contextLength = watch('context')?.length || 0;
    const dataLength = watch('data')?.length || 0;

    const text_color_context = contextLength >= 300
        ? 'text-red-500'
        : 'text-muted-foreground';

    const text_color_data = dataLength >= 200
        ? 'text-red-500'
        : 'text-muted-foreground';

    const onSubmit = async (values) => {
        await generateEmailContent(values);
    };

    useEffect(() => {
        if (aiResponse) {
            setGeneratedEmail(aiResponse);
        }
    }, [aiResponse]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEmail);
    };

    return (
        <div className="email-generator-container overflow-y-auto p-4 md:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 relative z-10">
            <Card className="input-section z-10" style={{
                background: "radial-gradient(125% 125% at 50% 70%, #fff 40%, #6b7280 100%)",
            }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle>{EMAIL_GENERATOR.TITLE}</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="show-advanced"
                                checked={showAdvanced}
                                onCheckedChange={(checked) => {
                                    setValue('showAdvanced', checked);
                                    if (!checked) {
                                        setValue('context', '');
                                        setValue('data', '');
                                    }
                                }}
                            />
                            <Label htmlFor="show-advanced">Advanced Options</Label>
                        </div>
                    </div>
                    <CardDescription>{EMAIL_GENERATOR.DESCRIPTION}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="subject">{EMAIL_GENERATOR.LABELS.SUBJECT}</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="subject"
                                                placeholder={EMAIL_GENERATOR.PLACEHOLDERS.SUBJECT}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {showAdvanced && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="context"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="context">{EMAIL_GENERATOR.LABELS.CONTEXT}</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Textarea
                                                            id="context"
                                                            placeholder={EMAIL_GENERATOR.PLACEHOLDERS.CONTEXT}
                                                            maxLength={300}
                                                            className={`resize-none min-h-[6rem] ${contextLength > 250 ? 'border-yellow-500' : ''
                                                                } ${contextLength >= 300 ? 'border-red-500' : ''}`}
                                                            {...field}
                                                        />
                                                        <div className={`absolute bottom-2 right-2 text-xs pointer-events-none ${text_color_context}`}>
                                                            {contextLength}/300
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="data"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="data">{EMAIL_GENERATOR.LABELS.DATA}</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Textarea
                                                            id="data"
                                                            placeholder={EMAIL_GENERATOR.PLACEHOLDERS.DATA}
                                                            maxLength={200}
                                                            className={`resize-none min-h-[6rem] ${dataLength > 150 ? 'border-yellow-500' : ''
                                                                } ${dataLength >= 200 ? 'border-red-500' : ''}`}
                                                            {...field}
                                                        />
                                                        <div className={`absolute bottom-2 right-2 text-xs pointer-events-none ${text_color_data}`}>
                                                            {dataLength}/200
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <div className="flex flex-col md:flex-row items-start justify-between gap-6 w-full">
                                <FormField
                                    control={form.control}
                                    name="tone"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel htmlFor="tone">{EMAIL_GENERATOR.LABELS.TONE}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select tone" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {EMAIL_GENERATOR.TONE_OPTIONS.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="creativity"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel htmlFor="creativity">{EMAIL_GENERATOR.LABELS.CREATIVITY}</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                                                        <span>{EMAIL_GENERATOR.CREATIVITY_LABELS.LESS}</span>
                                                        <span>{EMAIL_GENERATOR.CREATIVITY_LABELS.MORE}</span>
                                                    </div>
                                                    <Slider
                                                        id="creativity"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        value={[field.value]}
                                                        onValueChange={([value]) => field.onChange(value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="generate-button" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <svg className="mr-2 h-4 w-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                            <path d="M12 4.5V2l-3 3 3 3V4.5z" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                                        </svg>
                                        {EMAIL_GENERATOR.BUTTON_TEXT}
                                    </>
                                )}
                            </Button>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="output-section z-10" style={{
                background: "radial-gradient(125% 125% at 50% 70%, #fff 40%, #6b7280 100%)",
            }}>
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
                    {/* <Button variant="outline" size="sm" disabled={!generatedEmail}>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Edit
                    </Button> */}
                </CardFooter>
            </Card>
        </div>

    );
}


export default EmailGenerator;
<div className="min-h-screen w-full relative">
  {/* Radial Gradient Background from Bottom */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
    }}
  />
  {/* Your Content/Components */}
</div>
