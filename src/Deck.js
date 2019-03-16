import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width; //take a width of device
const SWIPE_THRESHOLD = 0.25*SCREEN_WIDTH;

class Deck extends Component{

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
               } else if (gesture.dx < - SWIPE_THRESHOLD){
                   console.log('DisLike');
               } else { this.resetPosition();
            }
           }
        });
        this.state = { panResponder, position };
    }

    resetPosition(){
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0}
        }).start();
    }

    renderCards(){
        return this.props.data.map((item, index) => {
            if( index === 0 ){
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