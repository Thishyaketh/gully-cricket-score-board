import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import { pink } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Autosuggest from 'react-autosuggest'
import { BATTING, OUT } from '../constants/BattingStatus'
import { BOLD, CATCH, HIT_WICKET, RUN_OUT, STUMP } from '../constants/OutType'
import MathUtil from '../util/MathUtil';
import BallByBall from './BallByBall';
import CameraFeed from './CameraFeed';
import Scorecard from './Scorecard';
import Batting from './Batting';
import Bowling from './Bowling';
import ScoreActions from './ScoreActions';
import './BallByBall.css';
import './CameraFeed.css';
import './ScoreBoard.css';
import { radioGroupBoxstyle } from './ui/RadioGroupBoxStyle';

const ScoreBoard = () => {
  const matchFormat = localStorage.getItem('matchFormat');
  const [session, setSession] = useState('Session 1');

  const getInitialInnings = () => {
    if (matchFormat === 'Test') {
      return [
        { batters: [], bowlers: [] },
        { batters: [], bowlers: [] },
        { batters: [], bowlers: [] },
        { batters: [], bowlers: [] },
      ];
    }
    return [{ batters: [], bowlers: [] }, { batters: [], bowlers: [] }];
  };

  const [inningNo, setInningNo] = useState(1);
  const [match, setMatch] = useState({ innings: getInitialInnings() });
  const [currentRunStack, setCurrentRunStack] = useState([])
  const [totalRuns, setTotalRuns] = useState(0)
  const [extras, setExtras] = useState({ total: 0, wide: 0, noBall: 0 })
  const [runsByOver, setRunsByOver] = useState(0)
  const [wicketCount, setWicketCount] = useState(0)
  const [totalOvers, setTotalOvers] = useState(0)
  const [batters, setBatters] = useState([])
  const [ballCount, setBallCount] = useState(0)
  const [overCount, setOverCount] = useState(0)
  const [recentOvers, setRecentOvers] = useState([])
  const [batter1, setBatter1] = useState({})
  const [batter2, setBatter2] = useState({})
  const [battingOrder, setBattingOrder] = useState(0)
  const [isBatter1Edited, setBatter1Edited] = useState(false)
  const [isBatter2Edited, setBatter2Edited] = useState(false)
  const [isBowlerEdited, setBowlerEdited] = useState(false)
  const [bowler, setBowler] = useState({})
  const [bowlers, setBowlers] = useState([])
  const [inputBowler, setInputBowler] = useState('')
  const [isModalOpen, setModalOpen] = React.useState(false)
  const [outType, setOutType] = React.useState('');
  const [fielderName, setFielderName] = React.useState('');
  const [runOutPlayerId, setRunOutPlayerId] = React.useState('');
  const [isExtraModalOpen, setExtraModalOpen] = React.useState(false);
  const [extraType, setExtraType] = React.useState('');
  const [remainingBalls, setRemainingBalls] = useState(0)
  const [remainingRuns, setRemainingRuns] = useState(0)
  const [strikeValue, setStrikeValue] = React.useState('strike')
  const [isNoBall, setNoBall] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [hasNameSuggested, setNameSuggested] = useState(false)
  const [hasMatchEnded, setMatchEnded] = useState(false)

  let data = JSON.parse(localStorage.getItem('data'));
  const { batting, team1, team2, team1Players, team2Players } = data;
  const maxOver = parseInt(data.maxOver);
  const history = useHistory();
  const [battingTeamPlayers, setBattingTeamPlayers] = useState(
    batting === team1 ? team1Players : team2Players
  );
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState(
    batting === team1 ? team2Players : team1Players
  );

  useEffect(() => {
    const endInningButton = document.getElementById('end-inning');
    endInningButton.disabled = true;

    const handleKeyDown = (event) => {
      const key = event.key;
      if (key >= '0' && key <= '6') {
        handleRun(parseInt(key, 10));
      } else if (key === 'n') {
        handleNoBall();
      } else if (key === 'q') {
        handleWide();
      } else if (key === 'w') {
        setModalOpen(true);
      } else if (key === 'c' && matchFormat === 'Test') {
        // call off session
        const newSession = session === 'Session 1' ? 'Lunch' : session === 'Session 2' ? 'Tea' : 'Stumps';
        setSession(newSession);
      } else if (key === 's' && matchFormat === 'Test') {
        // start new session
        const newSession = session === 'Lunch' ? 'Session 2' : session === 'Tea' ? 'Session 3' : 'Session 1';
        setSession(newSession);
      } else if (key === 'd' && matchFormat === 'Test') {
        handleEndInning();
      } else if (key === 'b') {
        handleBye();
      } else if (key === 'l') {
        handleLegBye();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleEndInning = (e) => {
    const endInningButton = document.getElementById('end-inning')
    if (endInningButton.textContent === 'Reset') {
      history.push('/')
    } else {
      if (batter1.id !== undefined) {
        const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1
        batters.push({
          id,
          name,
          run,
          ball,
          four,
          six,
          strikeRate,
          onStrike,
          battingOrder: batter1.battingOrder,
          battingStatus: BATTING,
        })
      }
      if (batter2.id !== undefined) {
        batters.push({
          id: batter2.id,
          name: batter2.name,
          run: batter2.run,
          ball: batter2.ball,
          four: batter2.four,
          six: batter2.six,
          strikeRate: batter2.strikeRate,
          onStrike: batter2.onStrike,
          battingOrder: batter2.battingOrder,
          battingStatus: BATTING,
        })
      }
      if (bowler.id !== undefined) {
        const currentDisplayOver = Math.round((ballCount === 6 ? 1 : ballCount * 0.1) * 10) / 10
        let isMaidenOver = true
        let countWicket = 0
        let countNoBall = 0
        let countWide = 0
        const deliveries = ['1', '2', '3', '4', '6', 'wd']
        for (let delivery of currentRunStack) {
          delivery = delivery.toString()
          if (deliveries.includes(delivery) || delivery.includes('nb')) {
            isMaidenOver = false
          }
          if (delivery === 'W') {
            countWicket++
          }
          if (delivery.includes('nb')) {
            countNoBall++
          }
          if (delivery.includes('wd')) {
            countWide++
          }
        }
        if (ballCount !== 6) {
          isMaidenOver = false
        }
        const index = bowlers.findIndex((blr) => {
          return blr.id === bowler.id
        })
        if (index !== -1) {
          const existingBowler = bowlers[index]
          const { maiden, wicket, noBall, wide, over } = existingBowler
          const bowlerTotalOver = over + ballCount / 6
          existingBowler.over = existingBowler.over + currentDisplayOver
          existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden
          existingBowler.run = existingBowler.run + runsByOver
          existingBowler.wicket = wicket + countWicket
          existingBowler.noBall = noBall + countNoBall
          existingBowler.wide = wide + countWide
          existingBowler.economy = Math.round((existingBowler.run / bowlerTotalOver) * 100) / 100
          bowlers[index] = existingBowler
          setBowlers(bowlers)
        } else {
          if (ballCount !== 6) {
            bowlers.push({
              id: bowler.id,
              name: bowler.name,
              over: currentDisplayOver,
              maiden: isMaidenOver ? 1 : 0,
              run: runsByOver,
              wicket: countWicket,
              noBall: countNoBall,
              wide: countWide,
              economy: Math.round((runsByOver / (ballCount / 6)) * 100) / 100,
            })
            setBowlers(bowlers)
          }
        }
      }
      const newInnings = [...match.innings];
      const currentInning = newInnings[inningNo - 1];
      const totalFours = batters.map((batter) => batter.four).reduce((prev, next) => prev + next, 0);
      const totalSixes = batters.map((batter) => batter.six).reduce((prev, next) => prev + next, 0);

      currentInning.runs = totalRuns;
      currentInning.wickets = wicketCount;
      currentInning.runRate = crr;
      currentInning.overs = totalOvers;
      currentInning.four = totalFours;
      currentInning.six = totalSixes;
      currentInning.extra = extras;
      currentInning.batters = batters;
      currentInning.bowlers = bowlers;

      setMatch({ innings: newInnings });

      if (inningNo < match.innings.length) {
        setInningNo(inningNo + 1);
        setCurrentRunStack([]);
        setTotalRuns(0);
        setExtras({ total: 0, wide: 0, noBall: 0 });
        setRunsByOver(0);
        setWicketCount(0);
        setTotalOvers(0);
        setBallCount(0);
        setOverCount(0);
        setRecentOvers([]);
        setBatter1({});
        setBatter2({});
        setBatters([]);
        setBowlers([]);
        setBattingOrder(0);
        setInputBowler('');
        setBowler({});
        setRemainingBalls(maxOver * 6);
        setRemainingRuns(totalRuns + 1);

        const bowlerNameElement = document.querySelector('.react-autosuggest__input');
        bowlerNameElement.disabled = false;

        const batter1NameElement = document.getElementById('batter1Name');
        batter1NameElement.value = '';
        batter1NameElement.disabled = false;

        const batter2NameElement = document.getElementById('batter2Name');
        batter2NameElement.value = '';
        batter2NameElement.disabled = false;

        setStrikeValue('strike');
        endInningButton.disabled = true;
      } else {
        endInningButton.textContent = 'Reset';
        setMatchEnded(true);
      }
    }
  }
  const handleBatter1Blur = (e) => {
    let name = e.target.value
    name = name.charAt(0).toUpperCase() + name.slice(1)
    e.target.value = name
    e.target.disabled = true
    if (isBatter1Edited) {
      setBatter1((state) => ({
        ...state,
        name: name,
      }))
      setBatter1Edited(false)
    } else {
      const randomNo = MathUtil.getRandomNo()
      setBatter1({
        id: name + randomNo,
        name: name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: strikeValue === 'strike' ? true : false,
        battingOrder: battingOrder + 1,
        battingStatus: BATTING,
      })
      setBattingOrder(battingOrder + 1)
    }
  }
  const handleBatter2Blur = (e) => {
    let name = e.target.value
    name = name.charAt(0).toUpperCase() + name.slice(1)
    e.target.value = name
    e.target.disabled = true
    if (isBatter2Edited) {
      setBatter2((state) => ({
        ...state,
        name: name,
      }))
      setBatter2Edited(false)
    } else {
      const randomNo = MathUtil.getRandomNo()
      setBatter2({
        id: name + randomNo,
        name: name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: strikeValue === 'non-strike' ? true : false,
        battingOrder: battingOrder + 1,
        battingStatus: BATTING,
      })
      setBattingOrder(battingOrder + 1)
    }
  }
  const handleBowlerBlur = (e) => {
    let name = e.target.value
    if (name !== '') {
      name = name.charAt(0).toUpperCase() + name.slice(1)
      setInputBowler(name)
      e.target.value = name
      e.target.disabled = true
      if (isBowlerEdited) {
        setBowler((state) => ({
          ...state,
          name: name,
        }))
        setBowlerEdited(false)
      } else {
        if (hasNameSuggested) {
          setNameSuggested(false)
        } else {
          const randomNo = MathUtil.getRandomNo()
          const id = name + randomNo
          setBowler({
            id,
            name,
          })
        }
      }
    }
  }
  const onSuggestionsFetchRequested = (param) => {
    const inputValue = param.value.trim().toLowerCase()
    const suggestionArr = inputValue.length === 0 ? [] : bowlers.filter((bowlerObj) => bowlerObj.name.toLowerCase().includes(inputValue))
    setSuggestions(suggestionArr)
  }
  const getSuggestionValue = (suggestion) => {
    setBowler({
      id: suggestion.id,
      name: suggestion.name,
    })
    setNameSuggested(true)
    return suggestion.name
  }
  const inputProps = {
    value: inputBowler,
    onChange: (e, { newValue }) => {
      setInputBowler(newValue)
    },
    onBlur: handleBowlerBlur,
  }
  const overCompleted = (runsByOverParam, currentRunStackParam) => {
    const bowlerNameElement = document.querySelector('.react-autosuggest__input')
    if (overCount + 1 === maxOver) {
      const endInningButton = document.getElementById('end-inning')
      endInningButton.disabled = false
    } else {
      bowlerNameElement.disabled = false
    }
    disableAllScoreButtons()
    setRecentOvers((state) => [
      ...state,
      { overNo: overCount + 1, bowler: bowler.name, runs: runsByOverParam, stack: currentRunStackParam },
    ])
    setInputBowler('')
    setBowler({})
    setCurrentRunStack([])
    setRunsByOver(0)
    setBallCount(0)
    setOverCount(overCount + 1)
    const index = bowlers.findIndex((blr) => blr.id === bowler.id)
    let isMaidenOver = true
    let countWicket = 0
    let countNoBall = 0
    let countWide = 0
    const deliveries = ['1', '2', '3', '4', '6', 'wd']
    for (let delivery of currentRunStackParam) {
      delivery = delivery.toString()
      if (deliveries.includes(delivery) || delivery.includes('nb')) {
        isMaidenOver = false
      }
      if (delivery === 'W') {
        countWicket++
      }
      if (delivery.includes('nb')) {
        countNoBall++
      }
      if (delivery.includes('wd')) {
        countWide++
      }
    }
    if (index !== -1) {
      const existingBowler = bowlers[index]
      const { over, maiden, run, wicket, noBall, wide } = existingBowler
      existingBowler.over = over + 1
      existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden
      existingBowler.run = run + runsByOverParam
      existingBowler.wicket = wicket + countWicket
      existingBowler.noBall = noBall + countNoBall
      existingBowler.wide = wide + countWide
      existingBowler.economy = Math.round((existingBowler.run / existingBowler.over) * 100) / 100
      bowlers[index] = existingBowler
      setBowlers(bowlers)
    } else {
      setBowlers((state) => [
        ...state,
        {
          id: bowler.id,
          name: bowler.name,
          over: 1,
          maiden: isMaidenOver ? 1 : 0,
          run: runsByOverParam,
          wicket: countWicket,
          noBall: countNoBall,
          wide: countWide,
          economy: runsByOverParam,
        },
      ])
    }
  }
  const newBatter1 = () => {
    const nextBatter = battingTeamPlayers[battingOrder + 1];
    const batter1NameElement = document.getElementById('batter1Name');
    batter1NameElement.value = nextBatter;
    batter1NameElement.disabled = true;

    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1;
    setBatters((state) => [
      ...state,
      {
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter1.battingOrder,
        battingStatus: OUT,
      },
    ])
    setBatter1({})
  }
  const newBatter2 = () => {
    const nextBatter = battingTeamPlayers[battingOrder + 1];
    const batter2NameElement = document.getElementById('batter2Name');
    batter2NameElement.value = nextBatter;
    batter2NameElement.disabled = true;

    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter2;
    setBatters((state) => [
      ...state,
      {
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter2.battingOrder,
        battingStatus: OUT,
      },
    ])
    setBatter2({})
  }
  const editBatter1Name = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const batter1NameElement = document.getElementById('batter1Name')
      batter1NameElement.disabled = false
      setBatter1Edited(true)
    }
  }
  const editBatter2Name = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const batter2NameElement = document.getElementById('batter2Name')
      batter2NameElement.disabled = false
      setBatter2Edited(true)
    }
  }
  const editBowlerName = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const bowlerNameElement = document.querySelector('.react-autosuggest__input')
      bowlerNameElement.disabled = false
      setBowlerEdited(true)
    }
  }
  const undoWicket = (isNoBallParam) => {
    if (!isNoBallParam) {
      setBallCount(ballCount - 1)
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10)
    }
    setWicketCount(wicketCount - 1)
    const batter = batters[batters.length - 1]
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter
    if (batter1.name === undefined || batter1.onStrike) {
      const batter1NameElement = document.getElementById('batter1Name')
      batter1NameElement.value = batter.name
      batter1NameElement.disabled = true
      setBatter1({
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter.battingOrder,
        battingStatus: BATTING,
      })
      if (!batter.onStrike) {
        changeStrikeRadio()
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    } else if (batter2.name === undefined || batter2.onStrike) {
      const batter2NameElement = document.getElementById('batter2Name')
      batter2NameElement.value = batter.name
      batter2NameElement.disabled = true
      setBatter2({
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter.battingOrder,
        battingStatus: BATTING,
      })
      if (!batter.onStrike) {
        changeStrikeRadio()
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    }
    batters.pop()
    setBatters(batters)
  }
  const undoRun = (run, isNoBallParam) => {
    if (isNoBallParam) {
      setTotalRuns(totalRuns - (run + 1))
      setRunsByOver(runsByOver - (run + 1))
    } else {
      setTotalRuns(totalRuns - run)
      setRunsByOver(runsByOver - run)
      setBallCount(ballCount - 1)
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10)
      currentRunStack.pop()
      setCurrentRunStack(currentRunStack)
    }
    if (batter1.onStrike) {
      if (run % 2 === 0) {
        setBatter1((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      } else {
        changeStrikeRadio()
        switchBatterStrike()
        setBatter2((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      }
    } else if (batter2.onStrike) {
      if (run % 2 === 0) {
        setBatter2((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      } else {
        changeStrikeRadio()
        switchBatterStrike()
        setBatter1((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      }
    }
  }
  const undoDelivery = () => {
    if (currentRunStack.length > 0) {
      const last = currentRunStack[currentRunStack.length - 1]
      if (typeof last === 'number') {
        const run = parseInt(last)
        undoRun(run, false)
      } else {
        currentRunStack.pop()
        setCurrentRunStack(currentRunStack)
        if (last === 'wd') {
          setTotalRuns(totalRuns - 1)
          setExtras((state) => ({
            ...state,
            total: state.total - 1,
            wide: state.wide - 1,
          }))
        } else if (last === 'W') {
          undoWicket(false)
        } else {
          const lastChar = last.substr(last.length - 1)
          const run = parseInt(lastChar)
          if (isNaN(run)) {
            setTotalRuns(totalRuns - 1)
            setRunsByOver(runsByOver - 1)
            if (last !== 'nb') {
              undoWicket(true)
            }
          } else {
            undoRun(run, true)
          }
        }
      }
    }
  }
  const handleStrikeChange = (e) => {
    changeStrikeRadio(e.target.value)
    if (e.target.value === 'strike') {
      switchBatterStrike('batter1')
    } else {
      switchBatterStrike('batter2')
    }
  }
  const changeStrikeRadio = (strikeParam) => {
    if (strikeParam === undefined) {
      setStrikeValue(strikeValue === 'strike' ? 'non-strike' : 'strike')
    } else {
      setStrikeValue(strikeParam)
    }
  }
  const switchBatterStrike = (strikeParam) => {
    if (strikeParam === undefined) {
      setBatter1((state) => ({
        ...state,
        onStrike: !state.onStrike,
      }))
      setBatter2((state) => ({
        ...state,
        onStrike: !state.onStrike,
      }))
    } else {
      if (strikeParam === 'batter1') {
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }))
        setBatter2((state) => ({
          ...state,
          onStrike: false,
        }))
      } else if (strikeParam === 'batter2') {
        setBatter1((state) => ({
          ...state,
          onStrike: false,
        }))
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    }
  }
  const handleRun = (run) => {
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, 'nb' + run])
      removeNoBallEffect()
    } else {
      setBallCount(ballCount + 1)
      setCurrentRunStack((state) => [...state, run])
    }
    setTotalRuns(totalRuns + run)
    setRunsByOver(runsByOver + run)
    if (inningNo % 2 === 0 && matchFormat !== 'Test') {
      if (!isNoBall) {
        setRemainingBalls(remainingBalls - 1)
      }
      setRemainingRuns(remainingRuns - run)
    }
    if (ballCount === 5) {
      if (isNoBall) {
        if (run % 2 !== 0) {
          changeStrikeRadio()
        }
      } else {
        setTotalOvers(overCount + 1)
        const arr = [...currentRunStack]
        arr.push(run)
        overCompleted(runsByOver + run, arr)
        if (run % 2 === 0) {
          changeStrikeRadio()
        }
      }
    } else {
      if (!isNoBall) {
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
      }
      if (run % 2 !== 0) {
        changeStrikeRadio()
      }
    }
    if (batter1.onStrike) {
      setBatter1((state) => {
        const updatedRun = state.run + run
        const updatedBall = state.ball + 1
        const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
        let four = state.four
        if (run === 4) {
          four = four + 1
        }
        let six = state.six
        if (run === 6) {
          six = six + 1
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        }
      })
      if (isNoBall) {
        if (run % 2 !== 0) {
          switchBatterStrike()
        }
      } else {
        if ((ballCount === 5 && run % 2 === 0) || (ballCount !== 5 && run % 2 !== 0)) {
          switchBatterStrike()
        }
      }
    } else {
      setBatter2((state) => {
        const updatedRun = state.run + run
        const updatedBall = state.ball + 1
        const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
        let four = state.four
        if (run === 4) {
          four = four + 1
        }
        let six = state.six
        if (run === 6) {
          six = six + 1
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        }
      })
      if ((ballCount === 5 && run % 2 === 0) || (ballCount !== 5 && run % 2 !== 0)) {
        switchBatterStrike()
      }
    }
  }
  const handleNoBall = () => {
    if (inningNo === 2) {
      setRemainingRuns(remainingRuns - 1)
    }
    setTotalRuns(totalRuns + 1)
    setRunsByOver(runsByOver + 1)
    setExtras((state) => ({
      ...state,
      total: state.total + 1,
      noBall: state.noBall + 1,
    }))
    addNoBallEffect()
  }
  const addNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add('score-types-button-noball')
    }
    setNoBall(true)
  }
  const removeNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove('score-types-button-noball')
    }
    setNoBall(false)
  }
  const handleWide = () => {
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, 'nb'])
      removeNoBallEffect()
    } else {
      if (inningNo === 2) {
        setRemainingRuns(remainingRuns - 1)
      }
      setCurrentRunStack((state) => [...state, 'wd'])
      setTotalRuns(totalRuns + 1)
      setRunsByOver(runsByOver + 1)
      setExtras((state) => ({
        ...state,
        total: state.total + 1,
        wide: state.wide + 1,
      }))
    }
  }
  const handleWicket = (isRunOut, playerId) => {
    setRunOutPlayerId('')
    if (ballCount === 5) {
      if (isNoBall) {
        removeNoBallEffect()
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, 'nbW'])
          setWicketCount(wicketCount + 1)
          disableAllScoreButtons()
        } else {
          setCurrentRunStack((state) => [...state, 'nb'])
        }
      } else {
        setTotalOvers(overCount + 1)
        const arr = [...currentRunStack]
        arr.push('W')
        overCompleted(runsByOver, arr)
        setWicketCount(wicketCount + 1)
        disableAllScoreButtons()
      }
    } else {
      if (isNoBall) {
        removeNoBallEffect()
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, 'nbW'])
          setWicketCount(wicketCount + 1)
          disableAllScoreButtons()
        } else {
          setCurrentRunStack((state) => [...state, 'nb'])
        }
      } else {
        setBallCount(ballCount + 1)
        setCurrentRunStack((state) => [...state, 'W'])
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
        setWicketCount(wicketCount + 1)
        disableAllScoreButtons()
      }
    }
    if (isRunOut) {
      if (batter1.id === playerId) {
        newBatter1()
        changeStrikeRadio('strike')
        switchBatterStrike('batter1')
      } else {
        newBatter2()
        changeStrikeRadio('non-strike')
        switchBatterStrike('batter2')
      }
    } else {
      if (!isNoBall) {
        if (batter1.onStrike) {
          newBatter1()
        } else {
          newBatter2()
        }
      }
    }
    if (isNoBall) {
      if (isRunOut && wicketCount + 1 === 10) {
        const endInningButton = document.getElementById('end-inning')
        endInningButton.disabled = false
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = true
        const batter1NameElement = document.getElementById('batter1Name')
        batter1NameElement.disabled = true
        const batter2NameElement = document.getElementById('batter2Name')
        batter2NameElement.disabled = true
        setInputBowler('')
      }
    } else {
      if (wicketCount + 1 === 10) {
        const endInningButton = document.getElementById('end-inning')
        endInningButton.disabled = false
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = true
        const batter1NameElement = document.getElementById('batter1Name')
        batter1NameElement.disabled = true
        const batter2NameElement = document.getElementById('batter2Name')
        batter2NameElement.disabled = true
        setInputBowler('')
      }
    }
  }
  const handleCloseModal = () => {
    if (outType !== '') {
      if (outType === RUN_OUT) {
        if (runOutPlayerId !== '') {
          handleWicket(true, runOutPlayerId)
        }
      } else {
        handleWicket(false, '')
      }
    }
    setModalOpen(false)
    setOutType('')
    setRunOutPlayerId('')
  }
  const handleOutTypeChange = (e) => {
    const outTypeValue = e.target.value
    setOutType(outTypeValue)
    if (outTypeValue === RUN_OUT) {
      const runOutPlayerElement = document.getElementById('run-out-player')
      runOutPlayerElement.classList.remove('hide')
      const runOutPlayerErrorElement = document.getElementById('run-out-player-error')
      runOutPlayerErrorElement.classList.remove('hide')
    }
  }
  const handleRunOutPlayerChange = (e) => {
    const playerId = e.target.value
    const runOutPlayerErrorElement = document.getElementById('run-out-player-error')
    runOutPlayerErrorElement.classList.add('hide')
    setRunOutPlayerId(playerId)
  }

  const handleBye = () => {
    setExtraType('b');
    setExtraModalOpen(true);
  };

  const handleLegBye = () => {
    setExtraType('lb');
    setExtraModalOpen(true);
  };

  const endMatch = () => {
    disableAllScoreButtons()
    const endInningButton = document.getElementById('end-inning')
    if (endInningButton.textContent === 'Score Board') {
      endInningButton.disabled = false
    }
  }
  const disableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = true
    }
  }
  const enableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = false
    }
  }
  if (batter1.name !== undefined && batter2.name !== undefined && inputBowler !== '') {
    enableAllScoreButtons()
  }
  let rrr = (remainingRuns / (remainingBalls / 6)).toFixed(2)
  rrr = isFinite(rrr) ? rrr : 0
  const overs = overCount + ballCount / 6
  let crr = (totalRuns / overs).toFixed(2)
  crr = isFinite(crr) ? crr : 0
  const currentInningIndex = inningNo - 1;
  const currentInning = match.innings[currentInningIndex];
  const previousInning = inningNo > 1 ? match.innings[currentInningIndex - 1] : null;
  const scoringTeam = batting === team1 ? team1 : team2;
  const chasingTeam = scoringTeam === team1 ? team2 : team1;

  let winningMessage = '';
  let target = 0;
  if (matchFormat === 'Test') {
    if (inningNo === 4) {
      target = match.innings[0].runs + match.innings[2].runs - (match.innings[1].runs);
      if (totalRuns >= target) {
        winningMessage = `${chasingTeam} won by ${10 - wicketCount} wickets`;
        endMatch();
      } else if (wicketCount === 10 || totalOvers === maxOver) {
        if (totalRuns === target - 1) {
          winningMessage = 'Match Tied';
        } else {
          winningMessage = `${scoringTeam} won by ${target - totalRuns - 1} runs`;
        }
        endMatch();
      } else {
        winningMessage = `${chasingTeam} needs ${target - totalRuns} runs to win`;
      }
    }
  } else if (inningNo % 2 === 0) {
    target = previousInning ? previousInning.runs + 1 : 0;
    winningMessage = `${chasingTeam} needs ${target - totalRuns} runs in ${maxOver * 6 - (overCount * 6 + ballCount)} balls to win`;
    if (totalRuns >= target) {
      winningMessage = `${chasingTeam} won by ${10 - wicketCount} wickets`;
      endMatch();
    }
    if ((wicketCount >= 10 || overCount >= maxOver) && totalRuns < target - 1) {
      winningMessage = `${scoringTeam} won by ${target - totalRuns - 1} runs`;
      endMatch();
    }
    if (wicketCount < 10 && overCount === maxOver && totalRuns === target - 1) {
      winningMessage = 'Match Tied';
      endMatch();
    }
  }
  const welcomeContent = (
    <>
      <div></div>
      <div>Welcome to Gully Cricket Score Board</div>
      <div></div>
    </>
  )
  const firstInningCompletedContent = (
    <>
      {overCount === maxOver && <div>1st inning completed</div>}
      {wicketCount === 10 && <div>All Out</div>}
      <div>Please click "End Inning" button</div>
    </>
  )
  const remainingRunsContent = (
    <>
      <div>Target: {target}</div>
      <div>{winningMessage}</div>
      <div>RRR: {isNaN(rrr) ? 0 : rrr}</div>
    </>
  )
  return (
    <div className='container'>
      <CameraFeed />
      <div className='inning'>
        <div>
          {team1} vs {team2}, Inning {inningNo}
          {matchFormat === 'Test' && <span style={{ marginLeft: '20px' }}>{session}</span>}
        </div>
        <div>
          <button id='end-inning' onClick={handleEndInning}>
            {inningNo < match.innings.length ? 'End Inning' : 'Reset'}
          </button>
        </div>
      </div>
      <div id='badge' className='badge badge-flex'>
        {inningNo % 2 === 0 && matchFormat !== 'Test'
          ? remainingRunsContent
          : overCount === maxOver || wicketCount === 10
          ? inningCompletedContent
          : welcomeContent}
      </div>
      <div className='score-container'>
        <div>
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={radioGroupBoxstyle}>
              <FormControl component='fieldset'>
                <RadioGroup
                  row
                  aria-label='wicket'
                  name='row-radio-buttons-group'
                  onChange={handleOutTypeChange}
                  sx={{ alignItems: 'center' }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="wicket-type-label">Wicket Type</InputLabel>
                    <Select
                      labelId="wicket-type-label"
                      id="wicket-type"
                      value={outType}
                      label="Wicket Type"
                      onChange={handleOutTypeChange}
                    >
                      <MenuItem value={CATCH}>Catch</MenuItem>
                      <MenuItem value={STUMP}>Stump</MenuItem>
                      <MenuItem value={HIT_WICKET}>Hit Wicket</MenuItem>
                      <MenuItem value={BOLD}>Bold</MenuItem>
                      <MenuItem value={RUN_OUT}>Run Out</MenuItem>
                    </Select>
                  </FormControl>
                  {outType === CATCH && (
                    <TextField
                      id="fielder-name"
                      label="Fielder Name"
                      variant="standard"
                      value={fielderName}
                      onChange={(e) => setFielderName(e.target.value)}
                    />
                  )}
                  {outType === RUN_OUT && (
                    <select defaultValue='' id='run-out-player' className='run-out-player' onChange={handleRunOutPlayerChange}>
                      <option value='' disabled>
                        select option
                      </option>
                      <option value={batter1.id}>{batter1.name}</option>
                      <option value={batter2.id}>{batter2.name}</option>
                    </select>
                  )}
                </RadioGroup>
                <div id='run-out-player-error' className='run-out-player-error hide'>
                  Please select run out player name
                </div>
                <Button onClick={handleCloseModal}>Submit</Button>
              </FormControl>
            </Box>
          </Modal>
          <Modal open={isExtraModalOpen} onClose={() => setExtraModalOpen(false)}>
            <Box sx={radioGroupBoxstyle}>
              <TextField
                id="extra-runs"
                label="Runs"
                variant="standard"
                type="number"
              />
              <Button onClick={() => {
                const runs = parseInt(document.getElementById('extra-runs').value);
                if (!isNaN(runs)) {
                  setTotalRuns(totalRuns + runs);
                  setExtras((state) => ({ ...state, total: state.total + runs }));
                  setCurrentRunStack((state) => [...state, `${runs}${extraType}`]);
                  setBallCount(ballCount + 1);
                  setExtraModalOpen(false);
                }
              }}>Submit</Button>
            </Box>
          </Modal>
        </div>
        <Scorecard
          scoringTeam={inningNo % 2 !== 0 ? scoringTeam : chasingTeam}
          totalRuns={totalRuns}
          wicketCount={wicketCount}
          totalOvers={totalOvers}
          crr={crr}
        />
        <Batting
          strikeValue={strikeValue}
          handleStrikeChange={handleStrikeChange}
          batter1={batter1}
          batter2={batter2}
          handleBatter1Blur={handleBatter1Blur}
          handleBatter2Blur={handleBatter2Blur}
          editBatter1Name={editBatter1Name}
          editBatter2Name={editBatter2Name}
        />
        <Bowling
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          inputProps={inputProps}
          editBowlerName={editBowlerName}
          currentRunStack={currentRunStack}
          undoDelivery={undoDelivery}
        />
        <ScoreActions
          handleRun={handleRun}
          handleNoBall={handleNoBall}
          handleWide={handleWide}
          setModalOpen={setModalOpen}
        />
        <div className='extras-container'>
          <div>Extras: {extras.total}</div>
          <div>Wd: {extras.wide}</div>
          <div>NB: {extras.noBall}</div>
        </div>
        <div className='recent-over-container'>
          <div className='recent-over-text'>Recent Overs</div>
          <div className='recent-over-details'>
            <table>
              <tbody>
                {recentOvers.map((recentOver, i) => (
                  <tr key={i}>
                    <td>{recentOver.overNo}.</td>
                    <td>{recentOver.bowler}:</td>
                    <td>
                      <div className='recent-over-runs'>
                        {recentOver.stack.map((run, index) => (
                          <div key={index}>{run}</div>
                        ))}
                      </div>
                    </td>
                    <td className='recent-over-total-run'>
                      <div>{recentOver.runs}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='score-board-container'>
          <div className='score-board-text text-center'>Score Board</div>
          {match.innings.map((inning, i) => {
            const isCurrentInning = i === currentInningIndex;
            const team = i % 2 === 0 ? scoringTeam : chasingTeam;
            return (
              <div key={i}>
                <div className='score-board-innings'>
                  <div>{team} Innings {Math.floor(i / 2) + 1}</div>
                  <div>RR: {isCurrentInning ? crr : inning.runRate}</div>
                  <div>
                    {isCurrentInning ? totalRuns : inning.runs}-
                    {isCurrentInning ? wicketCount : inning.wickets} (
                    {isCurrentInning ? totalOvers : inning.overs} Ov)
                  </div>
                </div>
                <div className='sb-batting'>
                  <table>
                    <thead>
                      <tr>
                        <td className='score-types padding-left'>Batter</td>
                        <td className='score-types'>R(B)</td>
                        <td className='score-types text-center'>4s</td>
                        <td className='score-types text-center'>6s</td>
                        <td className='score-types text-center'>SR</td>
                      </tr>
                    </thead>
                    <tbody>
                      {inning.batters.map((batter, j) => {
                        return (
                          <tr key={j}>
                            <td className='score-types padding-left'>{batter.name}</td>
                            <td className='score-types'>
                              {batter.run}({batter.ball})
                            </td>
                            <td className='score-types text-center'>{batter.four}</td>
                            <td className='score-types text-center'>{batter.six}</td>
                            <td className='score-types text-center'>{batter.strikeRate}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td className='score-types padding-left'>Extras:</td>
                        <td className='score-types'>
                          {isCurrentInning ? extras.total : inning.extra ? inning.extra.total : 0}
                        </td>
                        <td className='score-types text-center'>
                          wd: {isCurrentInning ? extras.wide : inning.extra ? inning.extra.wide : 0}
                        </td>
                        <td className='score-types text-center'>
                          nb: {isCurrentInning ? extras.noBall : inning.extra ? inning.extra.noBall : 0}
                        </td>
                        <td className='score-types text-center'></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='sb-bowling'>
                  <table>
                    <thead>
                      <tr>
                        <td className='score-types padding-left'>Bowler</td>
                        <td className='score-types'>O</td>
                        <td className='score-types text-center'>M</td>
                        <td className='score-types text-center'>R</td>
                        <td className='score-types text-center'>W</td>
                        <td className='score-types text-center'>NB</td>
                        <td className='score-types text-center'>WD</td>
                        <td className='score-types text-center'>ECO</td>
                      </tr>
                    </thead>
                    <tbody>
                      {inning.bowlers.map((blr, k) => {
                        const { name, over, maiden, run, wicket, noBall, wide, economy } = blr;
                        return (
                          <tr key={k}>
                            <td className='score-types padding-left'>{name}</td>
                            <td className='score-types'>{over}</td>
                            <td className='score-types text-center'>{maiden}</td>
                            <td className='score-types text-center'>{run}</td>
                            <td className='score-types text-center'>{wicket}</td>
                            <td className='score-types text-center'>{noBall}</td>
                            <td className='score-types text-center'>{wide}</td>
                            <td className='score-types text-center'>{economy}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BallByBall recentOvers={recentOvers} />
    </div>
  )
}

export default ScoreBoard
