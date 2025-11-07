import { useState, useRef } from 'react';
import { Upload, FileText, BookOpen, Download, Copy } from 'lucide-react';

const NotesSummarizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Array<{question: string, answer: string}>>([]);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setSummary([]);
      setFlashcards([]);
      setKeyPoints([]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setSummary([]);
      setFlashcards([]);
      setKeyPoints([]);
    }
  };

  const processFile = () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setSummary([
        "The water cycle is a continuous process that involves evaporation, condensation, and precipitation.",
        "Evaporation occurs when water changes from liquid to gas due to heat from the sun.",
        "Condensation happens when water vapor cools and turns back into liquid droplets.",
        "Precipitation includes rain, snow, sleet, and hail that falls from clouds to the Earth's surface.",
        "The cycle is essential for distributing water across the planet and supporting life."
      ]);
      
      setFlashcards([
        { question: "What are the three main stages of the water cycle?", answer: "Evaporation, condensation, and precipitation." },
        { question: "What causes evaporation in the water cycle?", answer: "Heat from the sun changes water from liquid to gas." },
        { question: "What is condensation in the water cycle?", answer: "When water vapor cools and turns back into liquid droplets." },
        { question: "What forms of precipitation are mentioned?", answer: "Rain, snow, sleet, and hail." }
      ]);
      
      setKeyPoints([
        "Water cycle is essential for distributing water across the planet",
        "Evaporation is caused by solar heat",
        "Condensation forms clouds",
        "Precipitation returns water to Earth's surface",
        "The cycle supports all life on Earth"
      ]);
      
      setIsProcessing(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSummary = () => {
    const content = summary.join('\n\n');
    downloadContent(content, 'summary.txt');
  };

  const downloadFlashcards = () => {
    const content = flashcards.map(fc => `Q: ${fc.question}\nA: ${fc.answer}`).join('\n\n');
    downloadContent(content, 'flashcards.txt');
  };

  const downloadKeyPoints = () => {
    const content = keyPoints.join('\n');
    downloadContent(content, 'key-points.txt');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1C1C1C] mb-6">Notes Summarizer</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Your Notes</h2>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#E63946] transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {fileName ? fileName : 'Drag & drop your PDF file here'}
          </p>
          <p className="text-gray-500 mb-4">or</p>
          <button className="bg-[#E63946] text-white py-2 px-6 rounded-lg hover:bg-[#d32f3f] transition-colors">
            Browse Files
          </button>
          <p className="text-sm text-gray-500 mt-4">Supports PDF files up to 10MB</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
        </div>
        
        {file && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={processFile}
              disabled={isProcessing}
              className="bg-[#E63946] text-white py-3 px-8 rounded-lg hover:bg-[#d32f3f] transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Summarize Notes
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {(summary.length > 0 || flashcards.length > 0 || keyPoints.length > 0) && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'summary' ? 'text-[#E63946] border-b-2 border-[#E63946]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'flashcards' ? 'text-[#E63946] border-b-2 border-[#E63946]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('flashcards')}
            >
              Flashcards
            </button>
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'keypoints' ? 'text-[#E63946] border-b-2 border-[#E63946]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('keypoints')}
            >
              Key Points
            </button>
          </div>
          
          {activeTab === 'summary' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <button
                  onClick={downloadSummary}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E63946]"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc pl-5 space-y-2">
                  {summary.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'flashcards' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Flashcards</h3>
                <button
                  onClick={downloadFlashcards}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E63946]"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards.map((card, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-[#E63946]">Q{index + 1}</h4>
                      <button
                        onClick={() => copyToClipboard(`${card.question}\n${card.answer}`)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-medium mb-2">{card.question}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">Answer:</p>
                      <p className="mt-1">{card.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'keypoints' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Key Points</h3>
                <button
                  onClick={downloadKeyPoints}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E63946]"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc pl-5 space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesSummarizer;
