import React, {
  Component
} from 'react';
import axios from 'axios';
import update from 'react-addons-update';
import Quiz from './components/Quiz';
import Result from './components/Result';
import logo from './svg/logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quizQuestions: [],
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Nintendo: 0,
        Microsoft: 0,
        Sony: 0
      },
      result: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5000/quiz')
      .then(res => {
        const quizQuestions = res.data
        this.setState({quizQuestions});

        const shuffledAnswerOptions = this.state.quizQuestions.map((question) => this.shuffleArray(question.answers));
        this.setState({
          question: this.state.quizQuestions[0].question,
          answerOptions: shuffledAnswerOptions[0]
        });
      });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // Enquanto houver elementos...
    while (0 !== currentIndex) {

      // Escola um elemento...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // E troque pelo elemento atual...
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId < this.state.quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: {
        $apply: (currentValue) => currentValue + 1
      }
    });

    this.setState({
      answersCount: updatedAnswersCount,
      answer: answer
    });
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: this.state.quizQuestions[counter].question,
      answerOptions: this.state.quizQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({
        result: result[0]
      });
    } else {
      this.setState({
        result: 'Undetermined'
      });
    }
  }

  renderQuiz() {
    return (<Quiz answer={this.state.answer}
                  answerOptions={this.state.answerOptions}
                  questionId={this.state.questionId}
                  question={this.state.question}
                  questionTotal={this.state.quizQuestions.length}
                  onAnswerSelected={this.handleAnswerSelected}
            />
    );
  }

  renderResult() {
    return (<Result quizResult={this.state.result}/>);
  }

  render() {
    return (<div className="App" >
      <div className="App-header" >
        <img src={logo}
          className="App-logo"
          alt="logo" />
        <h2> React Quiz </h2> </div> {
            this.state.result ? this.renderResult() : this.renderQuiz()
          } </div>
        );
      }
    }
    
export default App;