import React from "react";
import { getWeather } from "./weatherData";
import { Bars } from "react-loader-spinner";

interface IWeather {
  name: string;
  flag: string;
  weekdays: string[];
  icons: string[];
  maxTemps: number[];
  minTemps: number[];
}

interface ISevenDays {
  children?: React.ReactNode;
  weather: IWeather;
}

interface IAppState {
  input: string;
  error: string;
  weather: IWeather | null;
  isLoading: boolean;
}

const containerStyle = [
  "w-screen",
  "mx-9",
  "p-12",
  "border-solid",
  "border-2",
  "border-black",
  "flex",
  "flex-col",
  "gap-7",
  "items-center",
  "font-crazy",
  "outline",
  "outline-2",
  "outline-offset-4",
  "lg:max-w-fit",
].join(" ");

class App extends React.Component<unknown, IAppState> {
  state: IAppState = {
    input: "",
    error: "",
    weather: null,
    isLoading: false,
  };

  fetchWeather = async () => {
    if (this.state.input.length < 2) return;

    this.setState(() => ({ isLoading: true }));

    const result = await getWeather(this.state.input);

    if (!result) return;
    if (typeof result === "string") {
      this.setState((prev) => ({ ...prev, error: result, isLoading: false }));
    } else {
      this.setState((prev) => ({
        ...prev,
        weather: { ...result },
        isLoading: false,
      }));
    }
  };

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("ClassyWeatherInput", e.target.value);
    this.setState({ input: e.target.value });

    if (e.target.value.length < 2) this.setState({ weather: null });
  };

  ///// Lifecycle methods
  componentDidMount(): void {
    const storedData = localStorage.getItem("ClassyWeatherInput");
    if (storedData) this.setState({ input: storedData });
  }

  componentDidUpdate(
    _prevProps: Readonly<unknown>,
    prevState: Readonly<IAppState>
  ): void {
    if (prevState.input !== this.state.input) this.fetchWeather();
  }

  render() {
    const { weather, isLoading, input } = this.state;

    return (
      <>
        {/* App Container */}
        <div className={containerStyle}>
          <h1 className="text-4xl">Classy Weather</h1>
          <div>
            <SearchInput
              input={input}
              onInput={this.handleInput}
              isDisabled={false}
            />
          </div>
          {isLoading && (
            // <button
            //   className="border border-solid border-black rounded-md text-lg py-2 px-3"
            //   onClick={this.handleButtonClick}
            // >
            //   Get Weather
            // </button>

            <Bars color="black" visible={isLoading} height="2rem" />
          )}
          {weather && (
            <>
              <h2>
                Forecast for {weather.name} {weather.flag}
              </h2>
              <SevenDays weather={this.state.weather as IWeather} />
            </>
          )}
          <footer className="mt-8">
            <small>
              React Course Project by{" "}
              <a className="text-blue-500" href="https://codingheroes.io/">
                Jonas Schmedtmann
              </a>
            </small>
          </footer>
        </div>
      </>
    );
  }
}

interface ISearchInputProps {
  input: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
}

class SearchInput extends React.Component<ISearchInputProps> {
  render(): React.ReactNode {
    const { isDisabled, input, onInput } = this.props;

    return (
      <div>
        <input
          value={input}
          onChange={onInput}
          className="p-2 bg-red-100 text-center"
          type="text"
          placeholder="Search location"
          disabled={isDisabled}
        />
      </div>
    );
  }
}

class SevenDays extends React.Component<ISevenDays> {
  constructor(props: ISevenDays) {
    super(props);
  }

  componentWillUnmount(): void {
    console.log("Weather is out today!");
  }

  render() {
    const {
      weather: { icons, maxTemps, minTemps, weekdays },
    } = this.props;

    return (
      <ul className="flex flex-col sm:flex-row gap-3 font-sans">
        {weekdays.map((weekday, i) => (
          <OneDay
            key={i}
            day={i === 0 ? "Today" : weekday}
            icon={icons[i]}
            max={maxTemps[i]}
            min={minTemps[i]}
          />
        ))}
      </ul>
    );
  }
}

interface OneDayProps {
  day: string;
  icon: string;
  max: number;
  min: number;
}

class OneDay extends React.Component<OneDayProps> {
  constructor(props: OneDayProps) {
    super(props);
  }

  render() {
    const { day, icon, max, min } = this.props;

    return (
      <li className="w-24 bg-white flex flex-col items-center gap-2 p-2">
        <div>{day}</div>
        <div className="text-3xl">{icon}</div>
        <div className="font-light">
          Max <span className="text-red-400">{max}&deg;</span>
        </div>
        <div className="font-light">
          Min <span className="text-blue-400">{min}&deg;</span>
        </div>
      </li>
    );
  }
}

export default App;
