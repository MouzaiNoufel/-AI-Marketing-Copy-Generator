import React, { useState } from 'react';
import { Sparkles, Copy, Download, Wand2, Mail, Instagram, Facebook, RefreshCw, CheckCircle } from 'lucide-react';

export default function AIContentGenerator() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [contentType, setContentType] = useState('social-post');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { id: 'social-post', name: 'Social Media Post', icon: Instagram },
    { id: 'email', name: 'Email Campaign', icon: Mail },
    { id: 'ad-copy', name: 'Ad Copy', icon: Facebook },
    { id: 'product-desc', name: 'Product Description', icon: Wand2 },
  ];

  const tones = [
    { id: 'professional', name: 'Professional', emoji: '💼' },
    { id: 'casual', name: 'Casual', emoji: '😊' },
    { id: 'enthusiastic', name: 'Enthusiastic', emoji: '🎉' },
    { id: 'luxury', name: 'Luxury', emoji: '✨' },
  ];

  const generateContent = async () => {
    if (!productName || !description) return;

    setIsGenerating(true);
    setGeneratedContent('');

    const prompts = {
      'social-post': `Create an engaging social media post for ${productName}. Product details: ${description}. Tone: ${tone}. Include emojis and hashtags. Keep it under 280 characters.`,
      'email': `Write a compelling email campaign for ${productName}. Product details: ${description}. Tone: ${tone}. Include subject line and body with clear CTA.`,
      'ad-copy': `Create high-converting ad copy for ${productName}. Product details: ${description}. Tone: ${tone}. Focus on benefits and include a strong call-to-action.`,
      'product-desc': `Write a detailed product description for ${productName}. Product details: ${description}. Tone: ${tone}. Highlight key features and benefits.`,
    };

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompts[contentType]
            }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      let currentText = '';
      for (let i = 0; i < content.length; i++) {
        currentText += content[i];
        setGeneratedContent(currentText);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (error) {
      setGeneratedContent('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.replace(/\s+/g, '-')}-${contentType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent mb-3">
            AI Marketing Copy Generator
          </h1>
          <p className="text-violet-200 text-lg">
            Create professional marketing content in seconds with AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-violet-300" />
                Input Details
              </h2>

              {/* Product Name */}
              <div className="mb-6">
                <label className="block text-violet-200 text-sm font-medium mb-2">
                  Product/Service Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., EcoBottle Pro"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-violet-200 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product, key features, target audience..."
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Content Type */}
              <div className="mb-6">
                <label className="block text-violet-200 text-sm font-medium mb-3">
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setContentType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          contentType === type.id
                            ? 'bg-violet-500/30 border-violet-400 shadow-lg shadow-violet-500/30'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-2 ${contentType === type.id ? 'text-violet-300' : 'text-violet-400'}`} />
                        <span className={`text-sm font-medium ${contentType === type.id ? 'text-white' : 'text-violet-300'}`}>
                          {type.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-6">
                <label className="block text-violet-200 text-sm font-medium mb-3">
                  Tone of Voice
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {tones.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        tone === t.id
                          ? 'bg-fuchsia-500/30 border-fuchsia-400 shadow-lg shadow-fuchsia-500/30'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{t.emoji}</span>
                      <span className={`text-sm font-medium ${tone === t.id ? 'text-white' : 'text-violet-300'}`}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={isGenerating || !productName || !description}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-violet-500/30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-fuchsia-300" />
                  Generated Content
                </h2>

                {generatedContent && !isGenerating && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-violet-300" />
                      )}
                    </button>

                    <button
                      onClick={downloadContent}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-violet-300" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-black/20 rounded-xl p-6 border border-white/10">
                {generatedContent ? (
                  <div className="text-violet-100 text-base leading-relaxed whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="text-violet-300/60 text-center text-lg mt-20">
                    Your generated content will appear here ✨  
                    <br />
                    Fill in the details and click "Generate Content"
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
