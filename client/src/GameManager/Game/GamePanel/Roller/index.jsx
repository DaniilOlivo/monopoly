import Button from "../../../../components/Button"

import imgDice1 from "./img/dice_1.png"
import imgDice2 from "./img/dice_2.png"
import imgDice3 from "./img/dice_3.png"
import imgDice4 from "./img/dice_4.png"
import imgDice5 from "./img/dice_5.png"
import imgDice6 from "./img/dice_6.png"

import "./Roller.css"

function Roller(props) {
    function randomInt() {
        return Math.ceil(Math.random() * 6)
    }

    function randomArr() {
        return [randomInt(), randomInt()]
    }
    
    const mapDices = {
        1: imgDice1,
        2: imgDice2,
        3: imgDice3,
        4: imgDice4,
        5: imgDice5,
        6: imgDice6
    }

    return (
        <div className="roller">
            <div className="container-roller">
                <img src={mapDices[props.values[0]]} alt="dice" className="dice" />
                <img src={mapDices[props.values[1]]} alt="dice" className="dice" />
            </div>
            < Button title="Roll" disable={props.disable} onClick={() => props.roll(randomArr())} />
        </div>
    )
}

export default Roller
