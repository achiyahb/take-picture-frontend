'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import styled from 'styled-components';
import { TextField, Button, Box, Typography } from '@mui/material';
import { uploadImage } from '@/clients/picture.client';

const Wrapper = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
`;

/**
 * Converts a base64 dataURL string into a File object with a unique filename.
 */
function dataURLtoFile(dataURL: string, filename: string): File {
	const arr = dataURL.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}

/**
 * Generates a unique filename based on date, time, and index.
 */
function generateFilename(roomNumber: string, index: number): string {
	const now = new Date();
	const date = now.toISOString().split('T')[0]; // yyyy-mm-dd
	const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
	return `${roomNumber}_${date}_${time}_${index}.jpg`;
}

export default function CameraComponent() {
	const cameraRef = useRef<CameraType | null>(null);
	const [roomNumber, setRoomNumber] = useState<string>('');
	const [takingPictures, setTakingPictures] = useState<boolean>(false);
	const [showCamera, setShowCamera] = useState<boolean>(false);
	const [pictureCount, setPictureCount] = useState<number>(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startTakingPictures = () => {
		if (!roomNumber) return;
		setShowCamera(true); // מציג את המצלמה
		setTakingPictures(true);
		setPictureCount(0);
	};

	useEffect(() => {
		if (takingPictures) {
			intervalRef.current = setInterval(async () => {
				if (cameraRef.current) {
					const dataURL = cameraRef.current.takePhoto();
					const filename = generateFilename(roomNumber, pictureCount + 1); // יוצר שם קובץ ייחודי
					const file = dataURLtoFile(dataURL, filename);
					try {
						await uploadImage(file, roomNumber);
					} catch (e) {
						console.error(e);
					}
					setPictureCount((prev) => prev + 1);
				}
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [takingPictures, roomNumber, pictureCount]);

	useEffect(() => {
		if (pictureCount >= 50) {
			setTakingPictures(false);
		}
	}, [pictureCount]);

	return (
		<Wrapper>
			{!showCamera ? ( // מציג את הטופס אם showCamera הוא false
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					gap={2}
					width="90%"
					maxWidth="400px"
					padding="20px"
					bgcolor="#fff"
					borderRadius="10px"
					boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
				>
					<Typography variant="h6" gutterBottom>
						Enter Room Number
					</Typography>
					<TextField
						fullWidth
						label="Room Number"
						variant="outlined"
						value={roomNumber}
						onChange={(e) => setRoomNumber(e.target.value)}
					/>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={startTakingPictures}
						disabled={!roomNumber}
					>
						Start Taking Pictures
					</Button>
				</Box>
			) : (
				<>
					<Camera
						ref={cameraRef}
						aspectRatio="cover"
						facingMode="environment"
						style={{
							maxWidth: '90%',
							width: '400px',
							borderRadius: '10px',
							boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
						}}
					/>
					<Typography variant="body1" style={{ marginTop: '10px' }}>
						Pictures taken: {pictureCount}
					</Typography>
				</>
			)}
		</Wrapper>
	);
}
