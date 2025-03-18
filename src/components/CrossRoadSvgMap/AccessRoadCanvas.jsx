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

const cacheImages = async (srcArray) => {
    const promises = srcArray.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    });
    return Promise.all(promises);
  };

const typeToSvg = {
    "301001": Car,
    "301002": Van,
    "301003": Truck,
    "301004": LongTruck,
    "301005": Bus,
    "301006": Motorcycle,
    "301007": Bicycle,
}
const typeToColor = {
    "301001": "#3F07E2",
    "301002": "#AD00FF",
    "301003": "#FFA500",
    "301004":  "#FB5555",
    "301005":   "#21A957",
    "301006": "#D533B2",
    "301007":  "#6A1E55",
}


function rotateAboutZero(m, n) {
    const rad = -1 *n * Math.PI/180
    const rotationMatrix = matrix([[cos(rad), sin(rad)*-1],[sin(rad), cos(rad)]])
    const rotation = multiply(m, rotationMatrix)
    return rotation
}

function drawPoint(ctx, x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2, true); // Draw a small circle to represent the point
    ctx.fillStyle = color; // Set the color of the point
    ctx.fill();
    ctx.closePath();
}


const imageSources = [Car, Van, Truck, LongTruck, Bus, Motorcycle, Bicycle, TrafficLight];
const w = 195
const h = 555

function drawVehicle(ctx, vPos, imageMap){  
    // Assumptions x [-10, 350], y [-50, 50]
    // console.log(vPos, (vPos["xrelpos"] + 10) / 360 - 10/360, (vPos["yrelpos"] + 50) / 100 - 50/100)
    const x = ((vPos["xrelpos"] + 10) / 360 - 10/360) * w; // turn into unit
    const y = ((vPos["yrelpos"] + 50) / 100 - 50/100) * h; // turn into unit
    const type = vPos['vehicle_type'];
    let startMatrix = matrix([w/2,0])
    const rotated = rotateAboutZero(matrix([x,y]), 90)
    const el = imageMap[type];
    if (el){
        console.log(
            rotated.get([0]) + startMatrix.get([0]) - el.clientWidth / 2,
            rotated.get([1]) + startMatrix.get([1]) - el.clientHeight/2)
        ctx.drawImage(el,
            rotated.get([0]) + startMatrix.get([0]) - el.clientWidth / 2,
            rotated.get([1]) + startMatrix.get([1]) - el.clientHeight/2
        );
        // drawPoint(ctx, rotated.get([0]) * w + startMatrix.get([0]) - el.clientWidth / 2, rotated.get([1]) * h + startMatrix.get([1]) - el.clientHeight/2, typeToColor[type])
    }
}


export const AccessRoadCanvas = ({trafficPosData}) => {
    const canvasRef = useRef(null)
    const [imageMap, setImageMap] = useState({
        "301001": null,
        "301002": null,
        "301003": null,
        "301004": null,
        "301005": null,
        "301006": null,
        "301007": null,
        'trafficLight': null,
    })
    useEffect(() => {
        const loadImages = async () => {
            try {
            const loadedImages = await cacheImages(imageSources);
            const newImageMap = {};
            newImageMap['301001'] = loadedImages[0];
            newImageMap['301002'] = loadedImages[1];
            newImageMap['301003'] = loadedImages[2];
            newImageMap['301004'] = loadedImages[3];
            newImageMap['301005'] = loadedImages[4];
            newImageMap['301006'] = loadedImages[5];
            newImageMap['301007'] = loadedImages[6];
            // newImageMap['301008'] = loadedImages[7];
            newImageMap['trafficLight'] = loadedImages[7];
            setImageMap(newImageMap);
            } catch (error) {
            console.error('Error loading images:', error);
            }
        };
        loadImages();
    },[])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.fillStyle = "#3E3E3E";
        ctx.fillRect(0, 0, w, h);
        // Text
        ctx.fillStyle = "white";
        ctx.font = "12px serif";
        ctx.fillText("들어오는 도로", 10,20);
        ctx.fillText("나가는 도로", 10,h - 20);
        // Draw the center line
        ctx.beginPath()
        ctx.setLineDash([40,20])
        ctx.strokeStyle = "#D9D9D9"
        ctx.lineWidth = 5;
        ctx.moveTo(w/2, 0);
        ctx.lineTo(w/2, h);
        ctx.stroke();
        ctx.closePath();

        // Draw sides
        ctx.beginPath()
        ctx.setLineDash([])
        ctx.strokeStyle = "#D9D9D9"
        ctx.lineWidth = 5;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, h);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath()
        ctx.setLineDash([])
        ctx.strokeStyle = "#D9D9D9"
        ctx.lineWidth = 5;
        ctx.moveTo(w, 0);
        ctx.lineTo(w, h);
        ctx.stroke();
        ctx.closePath();

        // Draw data
        for (let d of trafficPosData){
            drawVehicle(ctx, d, imageMap)
        }
        
    },[trafficPosData])
    return(
        <>
        <canvas ref={canvasRef} id="canvas" height="555" width="195">
        </canvas>
        </>
    )
}