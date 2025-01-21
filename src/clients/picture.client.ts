interface UploadResponse {
    success: boolean;
    message?: string;
}

export async function uploadImage(
    imageFile: File,
    roomNumber: string | number,
    endpoint: string = 'http://172.20.10.14:4000/picture'
): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('roomNumber', String(roomNumber));

    const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }

    const data: UploadResponse = await response.json();
    return data;
}
