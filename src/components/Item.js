import React, { Component } from 'react';

export class Item extends Component {
  render() {
    return (
      <div className='item'>
        <img src={"./img/" + this.props.item.img} alt={this.props.item.title} />
        <h2>{this.props.item.title}</h2>
        <p>{this.props.item.desc}</p>
        <p>{this.props.item.price} руб.</p>
        <div className='add-to-cart' onClick={() => this.props.onAdd(this.props.item)}>+</div>
      </div>
    )
  }
}

export default Item;