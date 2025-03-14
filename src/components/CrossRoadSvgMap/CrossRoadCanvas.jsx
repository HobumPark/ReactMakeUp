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
export const CrossRoadCanvas = ({roads, trafficPosData}) => {
    React.useEffect(() => {
         // In the middle of the canvas
        const w = 786
        const h = 555
        const rect = matrix([w,h])
        const origin = matrix([w/2,h/2])
        const leftUnits = matrix([0, -40])
        const rightUnits = matrix([0,40])
        const roadLength = 100;
        const roadStart = 100
        const startOfRoad = add(origin,matrix([roadStart, 0]))
        const endOfRoad = add(startOfRoad, matrix([roadStart + roadLength,0]))
        const leftLineStart = add(startOfRoad,leftUnits)
        const leftLineEnd = add(endOfRoad, leftUnits)
        const rightLineStart = add(startOfRoad, rightUnits)
        const rightLineEnd = add(endOfRoad, rightUnits)
        const typeToSvg = {
            "301001": Car,
            "301002": Van,
            "301003": Truck,
            "301004": LongTruck,
            "301005": Bus,
            "301006": Motorcycle,
            "301007": Bicycle,
        }

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        // Rotate test
        // 1. move fixed point to origin 
        // 2. rotate R(angle)
        // 3. Move fixed point back
        function generateNewPointby90Degrees(m) {
            const rad = 90 * Math.PI/180
            const moved = subtract(m, origin);
            const rotationMatrix = matrix([[cos(rad), sin(rad)*-1],[sin(rad), cos(rad)]])
            const rotation = multiply(moved, rotationMatrix)
            const returnBack = add(rotation,origin);
            return returnBack;
        }
        function generateNewPointby45Degrees(m) {
            const rad = 45 * Math.PI/180
            const moved = subtract(m, origin);
            const rotationMatrix = matrix([[cos(rad), sin(rad)*-1],[sin(rad), cos(rad)]])
            const rotation = multiply(moved, rotationMatrix)
            const returnBack = add(rotation,origin);
            return returnBack;
        }
        function rotateAboutZero(m, n) {
            const rad = -1 *n * Math.PI/180
            const rotationMatrix = matrix([[cos(rad), sin(rad)*-1],[sin(rad), cos(rad)]])
            const rotation = multiply(m, rotationMatrix)
            return rotation
        }
        const EastCollectionOfPoints = [startOfRoad, endOfRoad, leftLineStart, leftLineEnd, rightLineStart, rightLineEnd]
        const NECollectionOfPoints = EastCollectionOfPoints.map(generateNewPointby45Degrees)
        const NorthCollectionOfPoints = NECollectionOfPoints.map(generateNewPointby45Degrees)
        const NWCollectionOfPoints = NorthCollectionOfPoints.map(generateNewPointby45Degrees)
        const WestCollectionOfPoints = NWCollectionOfPoints.map(generateNewPointby45Degrees)
        const SWCollectionOfPoints = WestCollectionOfPoints.map(generateNewPointby45Degrees)
        const SouthCollectionOfPoints = SWCollectionOfPoints.map(generateNewPointby45Degrees)
        const SECollectionOfPoints = SouthCollectionOfPoints.map(generateNewPointby45Degrees)
        const compassToCollection = {
            "E":EastCollectionOfPoints,
            "SE":SECollectionOfPoints,
            "S":SouthCollectionOfPoints,
            "SW":SWCollectionOfPoints,
            "W":WestCollectionOfPoints,
            "NW":NWCollectionOfPoints,
            "N":NorthCollectionOfPoints,
            "NE":NECollectionOfPoints,
        }
        const collectionOfPoints = roads.map(r => compassToCollection[r.incoming_compass])

        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, rect.get([0]), rect.get([1]));
        function drawRoad(collectionOfPoints){
            ctx.beginPath();
            ctx.moveTo(collectionOfPoints[2].get([0]),collectionOfPoints[2].get([1]));
            ctx.lineTo(collectionOfPoints[3].get([0]),collectionOfPoints[3].get([1]));
            ctx.moveTo(collectionOfPoints[4].get([0]),collectionOfPoints[4].get([1]));
            ctx.lineTo(collectionOfPoints[5].get([0]),collectionOfPoints[5].get([1]));
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.setLineDash([5,15])
            ctx.moveTo(collectionOfPoints[0].get([0]),collectionOfPoints[0].get([1]));
            ctx.lineTo(collectionOfPoints[1].get([0]),collectionOfPoints[1].get([1]));
            ctx.stroke();
            ctx.closePath();
            ctx.setLineDash([])
        }

        function drawPoint(x, y) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2, true); // Draw a small circle to represent the point
                ctx.fillStyle = 'black'; // Set the color of the point
                ctx.fill();
                ctx.closePath();
        }
        function drawVehicle(ctx, vPos, compass){
            // Assumptions x [-10, 350], y [-50, 50]
            const x = vPos["xrelpos"]/ 350 * 150;
            const y = vPos["yrelpos"]/ 350 * 40;
            console.log(x,y)
            const type = vPos['vehicle_type'];
            let startMatrix = matrix([0,0])
            let rotated = matrix([x,y])
            // Assuming max length position is 350m and least is -50m;
            if (compass === "E"){
                // noop
                startMatrix = EastCollectionOfPoints[0]
            } else if (compass === "S"){
                rotated = rotateAboutZero(rotated,90)
                startMatrix = SouthCollectionOfPoints[0]
            } else if (compass === "W"){
                rotated = rotateAboutZero(rotated,180)
                startMatrix = WestCollectionOfPoints[0]
            } else if (compass === "N"){
                rotated = rotateAboutZero(rotated,270)
                startMatrix = NorthCollectionOfPoints[0]
            }
            const el = new Image();
            el.src = typeToSvg[type]
            el.onload = () => ctx.drawImage(el,
                rotated.get([0]) + startMatrix.get([0]) - el.clientWidth / 2,
                rotated.get([1]) + startMatrix.get([1]) - el.clientHeight/2
            );
        }
        function drawTrafficLight(ctx, mat){
            const el = new Image();
            el.src=TrafficLight;
            el.onload = () => ctx.drawImage(el,mat.get([0]) - el.clientWidth / 2,mat.get([1]) - el.clientHeight/2, 10, 10);
        }
        const roadIdToRoad = {}
        roads.forEach(r => roadIdToRoad[r.road_id] = r)

        // DRAWING
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, rect.get([0]), rect.get([1]));
        collectionOfPoints.forEach(r => {drawRoad(r); drawTrafficLight(ctx,r[0])})
        for (let d of trafficPosData){
            const road_id = d.road_id;
            const dataForRoad = d.data;
            for (let roadObj of dataForRoad){
                console.log(roadObj, roadIdToRoad[road_id].incoming_compass)
                drawVehicle(ctx, roadObj, roadIdToRoad[road_id].incoming_compass)
            }
        }
      }, []);
    return(
        <>
        <canvas id="canvas" height="555" width="786">
        </canvas>
        </>
    )
}