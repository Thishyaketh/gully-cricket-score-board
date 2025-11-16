import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import HorizontalStepper from './HorizontalStepper'

const StepperContainer = () => {
  return (
    <div>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant='h6'>Multi Step Form</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box marginTop={10}>
          <HorizontalStepper />
        </Box>
      </Container>
    </div>
  )
}

export default StepperContainer
