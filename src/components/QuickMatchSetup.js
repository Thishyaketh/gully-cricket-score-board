import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PREMADE_MATCH } from '../constants/PremadeMatch';

const QuickMatchSetup = () => {
  const history = useHistory();
  const [tossWinner, setTossWinner] = useState(PREMADE_MATCH.team1);
  const [tossChoice, setTossChoice] = useState('Bat');
  const [maxOver, setMaxOver] = useState(String(PREMADE_MATCH.maxOver));
  const [team1Players, setTeam1Players] = useState([...PREMADE_MATCH.team1Players]);
  const [team2Players, setTeam2Players] = useState([...PREMADE_MATCH.team2Players]);

  const battingFirst =
    tossChoice === 'Bat'
      ? tossWinner
      : tossWinner === PREMADE_MATCH.team1
        ? PREMADE_MATCH.team2
        : PREMADE_MATCH.team1;

  const movePlayer = (teamSetter, index, direction) => {
    teamSetter((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleResetOrders = () => {
    setTeam1Players([...PREMADE_MATCH.team1Players]);
    setTeam2Players([...PREMADE_MATCH.team2Players]);
  };

  const handleStartMatch = (e) => {
    e.preventDefault();
    const parsedOvers = parseInt(maxOver, 10);
    const validOvers = Number.isFinite(parsedOvers) && parsedOvers > 0 ? parsedOvers : PREMADE_MATCH.maxOver;

    const matchData = {
      team1: PREMADE_MATCH.team1,
      team2: PREMADE_MATCH.team2,
      team1Players,
      team2Players,
      maxOver: String(validOvers),
      batting: battingFirst,
      tossWinner,
      tossChoice,
    };

    localStorage.setItem('matchFormat', PREMADE_MATCH.matchFormat);
    localStorage.setItem('data', JSON.stringify(matchData));
    history.push('/score');
  };

  const renderTeamOrderCard = (teamName, players, setPlayers) => (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {teamName} — Batting Order
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Use the arrows to adjust the batting order before the match starts.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {players.map((player, index) => (
            <Paper
              key={player}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.75,
                bgcolor: index < 2 ? 'action.hover' : 'background.paper',
              }}
            >
              <Typography variant="body1">
                <strong>{index + 1}.</strong> {player}
                {index < 2 && (
                  <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                    (Opener)
                  </Typography>
                )}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  aria-label={`Move ${player} up`}
                  disabled={index === 0}
                  onClick={() => movePlayer(setPlayers, index, -1)}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label={`Move ${player} down`}
                  disabled={index === players.length - 1}
                  onClick={() => movePlayer(setPlayers, index, 1)}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => history.push('/')}>
              Back
            </Button>
            <Typography variant="h5" fontWeight="bold">
              {PREMADE_MATCH.team1} vs {PREMADE_MATCH.team2}
            </Typography>
            <Button startIcon={<RestartAltIcon />} size="small" onClick={handleResetOrders}>
              Reset Order
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleStartMatch}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={5}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                    Who won the toss?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="tossWinner"
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value)}
                  >
                    <FormControlLabel value={PREMADE_MATCH.team1} control={<Radio />} label={PREMADE_MATCH.team1} />
                    <FormControlLabel value={PREMADE_MATCH.team2} control={<Radio />} label={PREMADE_MATCH.team2} />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                    Chose to?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="tossChoice"
                    value={tossChoice}
                    onChange={(e) => setTossChoice(e.target.value)}
                  >
                    <FormControlLabel value="Bat" control={<Radio />} label="Bat" />
                    <FormControlLabel value="Bowl" control={<Radio />} label="Bowl" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Overs"
                  inputProps={{ min: 1 }}
                  value={maxOver}
                  onChange={(e) => setMaxOver(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Paper
              variant="outlined"
              sx={{ p: 1.5, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText', textAlign: 'center' }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {tossWinner} won the toss and chose to {tossChoice} — {battingFirst} will bat first ({maxOver || PREMADE_MATCH.maxOver} Overs)
              </Typography>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                {renderTeamOrderCard(PREMADE_MATCH.team1, team1Players, setTeam1Players)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderTeamOrderCard(PREMADE_MATCH.team2, team2Players, setTeam2Players)}
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{ px: 4, py: 1.25 }}
              >
                Start Match
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QuickMatchSetup;
