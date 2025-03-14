import React, {useState, useEffect, useRef} from 'react'
import {matrix, add, subtract, multiply, cos, sin} from "mathjs";
import Bicycle from "../../assets/crossroad/bicycle.svg";
import Bus from "../../assets/crossroad/bus.svg";
import Car from "../../assets/crossroad/car.svg";
import LongTruck from "../../assets/crossroad/long_truck.svg";
import Motorcycle from "../../assets/crossroad/motorcycle.svg";
import Truck from "../../assets/crossroad/truck.svg";
import Van from "../../assets/crossroad/van.svg";
import TrafficLight from "../../assets/crossroad/trafficLight.svg";
const typeToSvg = {
    "301001": Car,
    "301002": Van,
    "301003": Truck,
    "301004": LongTruck,
    "301005": Bus,
    "301006": Motorcycle,
    "301007": Bicycle,
}


function rotateAboutZero(m, n) {
    const rad = -1 *n * Math.PI/180
    const rotationMatrix = matrix([[cos(rad), sin(rad)*-1],[sin(rad), cos(rad)]])
    const rotation = multiply(m, rotationMatrix)
    return rotation
}

const CrossWalkCanvas = ({trafficPosData}) => {
    React.useEffect(() => {
        const w = 195
        const h = 555
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, w, h);
        // Draw the center line
        ctx.beginPath()
        ctx.setLineDash([10,30])
        ctx.lineWidth = 100;
        ctx.strokeStyle = "white";
        ctx.moveTo(w/2, 0);
        ctx.lineTo(w/2, h);
        ctx.stroke();
        ctx.closePath();
        // Text
        ctx.fillStyle = "black";
        ctx.font = "12px serif";
        ctx.fillText("들어오는 도로", 10,20);
        ctx.fillText("나가는 도로", 10,h - 20);

        function drawVehicle(ctx, vPos){  
            // Assumptions x [-10, 350], y [-50, 50]
            // console.log(vPos, (vPos["xrelpos"] + 10) / 360 - 10/360, (vPos["yrelpos"] + 50) / 100 - 50/100)
            const x = ((vPos["xrelpos"] + 10) / 360 - 10/360); // turn into unit
            const y = ((vPos["yrelpos"] + 50) / 100 - 50/100); // turn into unit
            console.log(x,y)
            const type = vPos['vehicle_type'];
            let startMatrix = matrix([w/2,0])
            const rotated = rotateAboutZero(matrix([x,y]), 90)
            const el = new Image();
            el.src = typeToSvg[type]
            el.onload = () => ctx.drawImage(el,
                rotated.get([0]) * w + startMatrix.get([0]) - el.clientWidth / 2,
                rotated.get([1]) * h + startMatrix.get([1]) - el.clientHeight/2
            );
        }
        // Draw data
        for (let d of trafficPosData){
            drawVehicle(ctx, d)
        }
        
    })
    return(
        <>
        <canvas id="canvas" height="555" width="195">
        </canvas>
        </>
    )
}

export default CrossWalkCanvas