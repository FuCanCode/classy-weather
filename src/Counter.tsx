import React from "react";
type TCounter = { count: number };

class Counter extends React.Component<unknown, TCounter> {
  state: TCounter = { count: 0 };

  constructor(props: unknown) {
    super(props);
    this.state = { count: 3 };
    // this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
  }

  handleIncrement = () => {
    this.setState((prevState) => {
      return { ...prevState, count: prevState.count + 1 };
    });
  };

  handleDecrement() {
    // if (this.state.count <= 0) return;
    this.setState({ count: this.state.count - 1 });
  }

  render(): React.ReactNode {
    const curDate = new Date();
    const calcDate = new Date(
      curDate.setDate(curDate.getDate() + this.state.count)
    ).toDateString();

    return (
      <>
        <div className="flex gap-2">
          <button onClick={this.handleDecrement}>-</button>
          <span>{this.state.count}</span>
          <button onClick={this.handleIncrement}>+</button>
        </div>
        <p>{calcDate}</p>
      </>
    );
  }
}

export default Counter;
