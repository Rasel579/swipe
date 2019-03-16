import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width; //take a width of device
const SWIPE_THRESHOLD = 0.25*SCREEN_WIDTH;
const SWIPE_OUT_DURAION = 250;


class Deck extends Component{

    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }

    constructor(props){
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({ 
           onStartShouldSetPanResponder: () => true,
           onPanResponderMove: (event, gesture) => {
               position.setValue({ x: gesture.dx , y: gesture.dy });
           },
           onPanResponderRelease: (event, gesture) => {
               if (gesture.dx > SWIPE_THRESHOLD){
                   console.log('Like');
                   this.forceSwipe('right');
               } else if (gesture.dx < - SWIPE_THRESHOLD){
                   console.log('DisLike');
                   this.forceSwipe('left');
               } else { this.resetPosition();
            }
           }
        });
        this.state = { panResponder, position, index: 0 };
    }

    onSwipeComplete(direction){
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0});
        this.setState({index: this.state.index + 1});
    }

    forceSwipe(direction){
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x , y: 0 },
            duration: SWIPE_OUT_DURAION
        }).start(() => this.onSwipeComplete(direction));
    }

    resetPosition(){
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0}
        }).start();
    }

    renderCards(){
        
        if (this.state.index >= this.props.data.length){
            return this.props.renderNoMoreCards();
        }

        return this.props.data.map((item, i) => {
            if (i < this.state.index){
                return null;
            }
            if( i === this.state.index ){
                return (
                    <Animated.View
                        key={item.id}
                        { ...this.state.panResponder.panHandlers} 
                        style={this.getCardsStyle()}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return this.props.renderCard(item);
        });
    }

    getCardsStyle(){

        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH*1.5, 0, SCREEN_WIDTH*1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
         }
    }

    render(){
        return(
            <View>
                {this.renderCards()}
            </View> 
        );
    }
}


export default Deck;