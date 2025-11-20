/**
 * Converts a File object to a Base64 string.
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Analyzes an image by sending it to the local backend proxy.
 */
export const analyzeImage = async (file) => {
    try {
        const base64Image = await fileToBase64(file);

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze image');
        }

        const data = await response.json();
        return data.tags || [];

    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
};
