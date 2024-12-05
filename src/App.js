import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import './output.css'

const ImageUpload = () => {
  const apikey = process.env.REACT_APP_API_KEY;
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const genAI = new GoogleGenerativeAI(apikey);
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];

        const result = await model.generateContent([
          {
            inlineData: {
              data: base64data,
              mimeType: file.type,
            },
          },
          "Please solve the following mathematical expression and provide a clear, concise explanation of the solution. Respond only if the question is mathematical. Do Not emphasise any words by using bold, italics, or underlining. Do not include any additional information or irrelevant content.",
        ]);

        console.log(result);
        setResult(result.response.text());
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-800">NeuralMath: AI Interpreter for Handwritten Math</h1>
        <p className="mt-2 text-lg text-gray-600">Upload an image of handwritten math and let NeuralMath solve it for you!</p>
      </div>

      <div className="flex justify-center">
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="text-sm text-gray-700 file:border file:border-gray-300 file:rounded-md file:p-3 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 focus:outline-none"
        />
      </div>

      {imageUrl && (
        <div className="flex justify-center mt-6">
          <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-md border border-gray-200" />
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-6 rounded-md shadow-md text-gray-800 text-sm font-mono whitespace-pre-wrap mt-8 h-full">
          <h2 className="text-xl font-semibold text-gray-700">Math Expression Result</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto mt-4 h-full text-wrap">{result}</pre>
        </div>
      )}


      <div className="bg-gray-200 p-6 rounded-md shadow-md text-gray-800 mt-8">
        <h2 className="text-xl font-semibold text-gray-700">How to Use</h2>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Upload an image containing handwritten math equations.</li>
          <li>NeuralMath will automatically process and interpret the math.</li>
          <li>View the result as a solution or interpreted expression below.</li>
        </ul>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">© 2024 NeuralMath, All rights reserved.</p>
        <p className="text-gray-500 text-sm mt-2">For inquiries, contact us at <a href="mailto:support@neuralmath.com" className="text-blue-500 hover:text-blue-700">support@neuralmath.com</a></p>
      </div>
    </div>

  );
};

export default ImageUpload;