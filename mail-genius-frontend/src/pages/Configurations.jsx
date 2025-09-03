import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const Configurations = () => {
  const [googleClientId, setGoogleClientId] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const handleGoogleClientIdChange = (event) => {
    setGoogleClientId(event.target.value);
  };

  const handleGeminiApiKeyChange = (event) => {
    setGeminiApiKey(event.target.value);
  };

  const handleSave = () => {
    googleClientId && sessionStorage.setItem('googleClientId', googleClientId);
    geminiApiKey && sessionStorage.setItem('geminiApiKey', geminiApiKey);
    toast.success('Configurations saved successfully!');
    setGoogleClientId('');
    setGeminiApiKey('');
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-[100vh] bg-gradient-to-r from-purple-100 to-indigo-200 text-indigo-400 shadow-2xl rounded-xl" >
        <CardHeader className="text-2xl font-bold text-center">
          Configurations
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center">This page allows you to configure the application settings.</p>
          <Label htmlFor="googleClientId">GOOGLE CLIENT ID</Label>
          <Input
            id="googleClientId"
            placeholder="Enter your Google Client ID"
            className="bg-transparent border-white/50 text-indigo-300 placeholder:text-indigo-800/70"
            value={googleClientId}
            onChange={handleGoogleClientIdChange}
          />

          <Label htmlFor="geminiApiKey">GEMINI API KEY</Label>
          <Input
            id="geminiApiKey"
            placeholder="Enter your Gemini API Key"
            className="bg-transparent border-white/50 text-indigo-300 placeholder:text-indigo-800/70"
            value={geminiApiKey}
            onChange={handleGeminiApiKeyChange}
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Configurations;
