import { TextField, Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

const Root = styled('div')(({ theme }) => ({
  '.mainContainer': {
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  '.formContainer': {
    margin: '2rem 0 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  '.formGroup': {
    marginBottom: '2rem',
  },
  '.resetContainer': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  '.backButton': {
    marginRight: theme.spacing(1),
  },
  '.instructions': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  '.textField': {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  '.textfieldWidth': {
    width: 200,
  },
  '.teamNameHeading': {
    fontWeight: 'bold',
  },
  '.center': {
    textAlign: 'center',
  },
}));

const HorizontalStepper = () => {
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0)
  const [isSubmitting, setSubmitting] = React.useState(false)

  const steps = ['Team', 'Players', 'Overs', 'Batting']
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  const initialValues = {
    team1: '',
    team2: '',
    team1Players: Array(11).fill(''),
    team2Players: Array(11).fill(''),
    maxOver: '',
    batting: '',
  }
  const validationSchema = [
    Yup.object().shape({
      team1: Yup.string().required('Team Name is required'),
      team2: Yup.string().required('Team Name is required'),
    }),
    Yup.object().shape({
      team1Players: Yup.array().of(Yup.string().required('Player name is required')),
      team2Players: Yup.array().of(Yup.string().required('Player name is required')),
    }),
    Yup.object().shape({
      maxOver: Yup.string().required('Over is required'),
    }),
    Yup.object().shape({
      batting: Yup.string().required('Please choose who is Batting'),
    }),
  ]
  const currentValidationSchema = validationSchema[activeStep]
  function isLastStep() {
    return activeStep === steps.length - 1
  }
  return (
    <Root>
      <Stepper activeStep={activeStep} orientation='horizontal'>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className='mainContainer'>
        <Formik
          enableReinitialize
          validationSchema={currentValidationSchema}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            handleNext()
            actions.setTouched({})
            actions.setSubmitting(false)
            if (isLastStep()) {
              setSubmitting(true)
              const data = JSON.stringify(values)
              localStorage.setItem('data', data)
              history.push('/score')
              setSubmitting(false)
            }
          }}
        >
          {(prp) => {
            const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = prp
            return (
              <form onSubmit={handleSubmit}>
                <div className='formContainer'>
                  {activeStep === 0 && (
                    <div>
                      <div className='formGroup'>
                        <TextField
                          id='team1'
                          name='team1'
                          label='Team1 Name*'
                          value={values.team1}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.team1 && touched.team1 && errors.team1}
                          error={errors.team1 && touched.team1}
                          className='textfieldWidth'
                        />
                      </div>
                      <div>
                        <Typography className='center'>VS</Typography>
                      </div>
                      <div className='formGroup'>
                        <TextField
                          id='team2'
                          name='team2'
                          label='Team2 Name*'
                          value={values.team2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={errors.team2 && touched.team2 && errors.team2}
                          error={errors.team2 && touched.team2}
                          className='textfieldWidth'
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div>
                      <Typography className='teamNameHeading'>{values.team1}</Typography>
                      {values.team1Players.map((player, index) => (
                        <div className='formGroup' key={index}>
                          <TextField
                            id={`team1Players[${index}]`}
                            name={`team1Players[${index}]`}
                            label={`Player ${index + 1}`}
                            value={player}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className='textfieldWidth'
                          />
                        </div>
                      ))}
                      <Typography className='teamNameHeading'>{values.team2}</Typography>
                      {values.team2Players.map((player, index) => (
                        <div className='formGroup' key={index}>
                          <TextField
                            id={`team2Players[${index}]`}
                            name={`team2Players[${index}]`}
                            label={`Player ${index + 1}`}
                            value={player}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className='textfieldWidth'
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div>
                      <div className='formGroup' id='team1-players'>
                        <Typography className='teamNameHeading'>How many overs?</Typography>
                        <div className='formGroup'>
                          <TextField
                            id='maxOver'
                            name='maxOver'
                            label='Overs*'
                            value={values.maxOver}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={errors.maxOver && touched.maxOver && errors.maxOver}
                            error={errors.maxOver && touched.maxOver}
                            className='textfieldWidth'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div>
                      <div className='formGroup'>
                        <FormControl component='fieldset'>
                          <FormLabel component='legend'>Who is Batting?</FormLabel>
                          <RadioGroup
                            name='batting'
                            value={values.batting.toString()}
                            onChange={(event) => {
                              setFieldValue('batting', event.currentTarget.value)
                            }}
                          >
                            <FormControlLabel value={values.team1} control={<Radio />} label={values.team1} />
                            <FormControlLabel value={values.team2} control={<Radio />} label={values.team2} />
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </div>
                  )}
                  <div>
                    <Button variant='contained' disabled={activeStep === 0} onClick={handleBack} className='backButton'>
                      Back
                    </Button>
                    <Button id='submit' disabled={isSubmitting} variant='contained' color='primary' type='submit'>
                      {isLastStep() ? 'Start Game' : 'Next'}
                    </Button>
                  </div>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
    </Root>
  )
}

export default HorizontalStepper
