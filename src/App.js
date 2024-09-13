import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Items from "./components/Items"; // Import the Items component

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      items: [
        {
          "id": 1,
          "title": "Пень дубовый",
          "img": "pen_dub.jpg",
          "desc": "Массивный пень из дуба, идеальный для сада или декора.",
          "category": "Декор",
          "price": 3500
        },
        {
          "id": 2,
          "title": "Пень сосновый",
          "img": "pen_sosna.jpg",
          "desc": "Пень из сосны, подходит для создания уникальных садовых композиций.",
          "category": "Декор",
          "price": 2800
        },
        {
          "id": 3,
          "title": "Пень для сидения",
          "img": "pen_sidenie.jpg",
          "desc": "Пень, обработанный для использования в качестве стула или скамейки.",
          "category": "Мебель",
          "price": 4500
        },
        {
          "id": 4,
          "title": "Пень для костра",
          "img": "pen_kostyor.jpg",
          "desc": "Пень, специально подготовленный для быстрого розжига костра.",
          "category": "Туризм",
          "price": 1500
        },
        {
          "id": 5,
          "title": "Пень декоративный",
          "img": "pen_dekor.jpg",
          "desc": "Декоративный пень с резьбой, идеальный для украшения сада.",
          "category": "Декор",
          "price": 5000
        }
      ]
    }
    this.addToOrder = this.addToOrder.bind(this)
    this.deleteOrder = this.deleteOrder.bind(this)

  }

  render() {
    return (
      <div className="wrapper">
        <Header  orders={this.state.orders} onDelete={this.deleteOrder}/>
        <Items items={this.state.items} onAdd={this.addToOrder} />
        <Footer />
      </div>
    );
  }


  deleteOrder(id) {
    this.setState({orders: this.state.orders.filter(el => el.id !== id)})
  }



  addToOrder(item) {
    let isInArray = false
    this.state.orders.forEach(el => {
      if(el.id === item.id)
        isInArray = true
    })

    if(!isInArray)
      this.setState({orders: [...this.state.orders, item ] })

  }
}

export default App;