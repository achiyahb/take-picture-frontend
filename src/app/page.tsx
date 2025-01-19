'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useAppContext } from '@/context';
import { getUser } from '@/clients/users.client';
import { StagesNumberEnum } from '@/utils/enums/stages-number.enum';

const SplashScreen = () => {
  const router = useRouter();
  const { setUser, user } = useAppContext();

  useEffect(() => {
    if (user) {
      return;
    }
    (async () => {
      const newUser = await getUser();
      if (newUser?.id) {
        setUser(newUser);
      } else {
        router.push('/login');
      }
    })();
  }, [router, setUser, user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    let lastTrainerId = user.lastTrainerId;
    if (!lastTrainerId) {
      lastTrainerId = user.trainers?.[0]?.id;
    }

    (async () => {
      await navigateToStage(user?.stage, lastTrainerId);
    })();
  }, [user]);

  const navigateToStage = async (stage?: StagesNumberEnum, lastTrainerId?: number) => {
    if (!lastTrainerId) {
      return router.push('trainers/new');
    }
    switch (stage) {
      case StagesNumberEnum.IMAGES:
        router.push(`trainers/${lastTrainerId}/images`);
        break;
      case StagesNumberEnum.TRAININGS:
        router.push(`trainers/${lastTrainerId}/training`);
        break;
      case StagesNumberEnum.FINISH:
        router.push(`trainers`);
        break;
      case StagesNumberEnum.SETTINGS:
      default:
        router.push(`trainers/${lastTrainerId}/update`);
    }
  };

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '2rem',
              backgroundColor: '#f0f0f0',
            }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', marginBottom: '2rem' }}>
            AI Trainer
          </Typography>
          <Box
              sx={{
                width: '80%',
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
          >

          </Box>
        </Box>
      </Box>
  );
};

export default SplashScreen;
