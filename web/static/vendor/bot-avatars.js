/* bot-avatars 0.2.2 — MIT (c) Jakub Antalik. Xem bot-avatars.LICENSE.
 * Bản vendor: hai import React ở hai dòng đầu được trỏ sang ./react-shim.js
 * để chạy được trên trình duyệt không có bước build. Nội dung còn lại giữ nguyên. */
import { jsx as nc } from "./react-shim.js";
import { forwardRef as oc, useRef as to, useImperativeHandle as sc, useId as ec, useEffect as t0, useState as Je, useLayoutEffect as ac } from "./react-shim.js";
const G0 = {
  clover: { label: "Clover", color: "#41C4FF", face: "eyes", faceX: 50, faceY: 50, faceScale: 1, brightness: 1.2, saturation: 1.59 },
  flower: { label: "Flower", color: "#2FCB7A", face: "eyes", faceX: 50, faceY: 51, faceScale: 0.95 },
  triangle: { label: "Triangle", color: "#DC48FF", face: "eyes", faceX: 50, faceY: 61, faceScale: 0.9 },
  square: { label: "Square", color: "#35B8FF", face: "eyes", faceX: 50, faceY: 50, faceScale: 1 },
  blob: { label: "Blob", color: "#2FCB7A", face: "eyes", faceX: 49.5, faceY: 50, faceScale: 1 },
  ghost: { label: "Ghost", color: "#F4F2FA", face: "eyes", faceX: 50, faceY: 48, faceScale: 0.95 },
  circle: { label: "Circle", color: "#9A62FF", face: "eyes", faceX: 50, faceY: 50, faceScale: 1 },
  drop: { label: "Drop", color: "#1ED3C6", face: "eyes", faceX: 50, faceY: 62, faceScale: 0.9 },
  star: { label: "Star", color: "#EFDB8E", face: "eyes", faceX: 50, faceY: 52, faceScale: 0.82, brightness: 1.1, saturation: 1.84 },
  droid: { label: "Droid", color: "#D5DBEA", face: "eyes", faceX: 50, faceY: 60, faceScale: 0.95 },
  mech: { label: "Mech", color: "#95A6C4", face: "eyes", faceX: 50, faceY: 59, faceScale: 1 },
  alien: { label: "Alien", color: "#9CD66A", face: "eyes", faceX: 50, faceY: 45, faceScale: 1.05 },
  hexagon: { label: "Hexagon", color: "#EB7575", face: "eyes", faceX: 50, faceY: 50, faceScale: 0.95 },
  cat: { label: "Cat", color: "#EAA06F", face: "eyes", faceX: 50, faceY: 58, faceScale: 1, brightness: 1.22, saturation: 1.88 },
  cloud: { label: "Cloud", color: "#CFD5E4", face: "eyes", faceX: 50, faceY: 58, faceScale: 0.95 },
  pill: { label: "Pill", color: "#ACAAF3", face: "eyes", faceX: 50, faceY: 50, faceScale: 0.9 },
  pebble: { label: "Pebble", color: "#ABC793", face: "eyes", faceX: 50, faceY: 50, faceScale: 0.95 },
  puddle: { label: "Puddle", color: "#EE8BDB", face: "eyes", faceX: 50, faceY: 50, faceScale: 0.95 }
}, rc = Object.keys(G0), Mi = ["eyes", "mouth"], mi = ["default", "working", "sleeping"], yi = Object.fromEntries(
  rc.map((t) => [t, G0[t].color])
), ta = {
  default: "idle",
  working: "working",
  sleeping: "sleeping"
}, na = {
  clover: "M26.53 22.38A25 25 0 0 1 73.47 22.38A7 7 0 0 0 77.62 26.53A25 25 0 0 1 77.62 73.47A7 7 0 0 0 73.47 77.62A25 25 0 0 1 26.53 77.62A7 7 0 0 0 22.38 73.47A25 25 0 0 1 22.38 26.53A7 7 0 0 0 26.53 22.38Z",
  flower: "M31.2 19.82A20.5 20.5 0 0 1 68.8 19.82A5 5 0 0 0 72.9 22.8A20.5 20.5 0 0 1 84.51 58.55A5 5 0 0 0 82.95 63.37A20.5 20.5 0 0 1 52.54 85.47A5 5 0 0 0 47.46 85.47A20.5 20.5 0 0 1 17.05 63.37A5 5 0 0 0 15.49 58.55A20.5 20.5 0 0 1 27.1 22.8A5 5 0 0 0 31.2 19.82Z",
  triangle: "M38.75 27.43A13 13 0 0 1 61.25 27.43L82.7 64.49A13 13 0 0 1 71.45 84L28.55 84A13 13 0 0 1 17.3 64.49L38.75 27.43Z",
  square: "M93 50C93 53.66 92.96 58.23 92.88 60.97C92.8 63.71 92.67 64.81 92.51 66.44C92.35 68.08 92.15 69.44 91.9 70.77C91.66 72.1 91.37 73.3 91.04 74.44C90.72 75.58 90.35 76.63 89.94 77.63C89.53 78.63 89.07 79.55 88.58 80.43C88.08 81.31 87.54 82.13 86.96 82.9C86.37 83.67 85.75 84.39 85.07 85.07C84.39 85.75 83.67 86.37 82.9 86.96C82.13 87.54 81.31 88.08 80.43 88.58C79.55 89.07 78.63 89.53 77.63 89.94C76.63 90.35 75.58 90.72 74.44 91.04C73.3 91.37 72.1 91.66 70.77 91.9C69.44 92.15 68.08 92.35 66.44 92.51C64.81 92.67 63.71 92.8 60.97 92.88C58.23 92.96 53.66 93 50 93C46.34 93 41.77 92.96 39.03 92.88C36.29 92.8 35.19 92.67 33.56 92.51C31.92 92.35 30.56 92.15 29.23 91.9C27.9 91.66 26.7 91.37 25.56 91.04C24.42 90.72 23.37 90.35 22.37 89.94C21.37 89.53 20.45 89.07 19.57 88.58C18.69 88.08 17.87 87.54 17.1 86.96C16.33 86.37 15.61 85.75 14.93 85.07C14.25 84.39 13.63 83.67 13.04 82.9C12.46 82.13 11.92 81.31 11.42 80.43C10.93 79.55 10.47 78.63 10.06 77.63C9.65 76.63 9.28 75.58 8.96 74.44C8.63 73.3 8.34 72.1 8.1 70.77C7.85 69.44 7.65 68.08 7.49 66.44C7.33 64.81 7.2 63.71 7.12 60.97C7.04 58.23 7 53.66 7 50C7 46.34 7.04 41.77 7.12 39.03C7.2 36.29 7.33 35.19 7.49 33.56C7.65 31.92 7.85 30.56 8.1 29.23C8.34 27.9 8.63 26.7 8.96 25.56C9.28 24.42 9.65 23.37 10.06 22.37C10.47 21.37 10.93 20.45 11.42 19.57C11.92 18.69 12.46 17.87 13.04 17.1C13.63 16.33 14.25 15.61 14.93 14.93C15.61 14.25 16.33 13.63 17.1 13.04C17.87 12.46 18.69 11.92 19.57 11.42C20.45 10.93 21.37 10.47 22.37 10.06C23.37 9.65 24.42 9.28 25.56 8.96C26.7 8.63 27.9 8.34 29.23 8.1C30.56 7.85 31.92 7.65 33.56 7.49C35.19 7.33 36.29 7.2 39.03 7.12C41.77 7.04 46.34 7 50 7C53.66 7 58.23 7.04 60.97 7.12C63.71 7.2 64.81 7.33 66.44 7.49C68.08 7.65 69.44 7.85 70.77 8.1C72.1 8.34 73.3 8.63 74.44 8.96C75.58 9.28 76.63 9.65 77.63 10.06C78.63 10.47 79.55 10.93 80.43 11.42C81.31 11.92 82.13 12.46 82.9 13.04C83.67 13.63 84.39 14.25 85.07 14.93C85.75 15.61 86.37 16.33 86.96 17.1C87.54 17.87 88.08 18.69 88.58 19.57C89.07 20.45 89.53 21.37 89.94 22.37C90.35 23.37 90.72 24.42 91.04 25.56C91.37 26.7 91.66 27.9 91.9 29.23C92.15 30.56 92.35 31.92 92.51 33.56C92.67 35.19 92.8 36.29 92.88 39.03C92.96 41.77 93 46.34 93 50Z",
  blob: "M93.92 50C94.18 51.9 94.24 53.9 93.99 55.79C93.73 57.68 93.18 59.61 92.39 61.36C91.6 63.1 90.48 64.78 89.27 66.27C88.07 67.76 86.58 69.08 85.14 70.29C83.7 71.49 82.1 72.5 80.62 73.5C79.14 74.49 77.64 75.34 76.24 76.24C74.84 77.15 73.51 78 72.2 78.93C70.88 79.86 69.66 80.83 68.36 81.8C67.06 82.76 65.78 83.82 64.39 84.74C63 85.67 61.55 86.63 60.01 87.35C58.47 88.08 56.82 88.73 55.15 89.1C53.48 89.47 51.71 89.64 50 89.57C48.29 89.5 46.55 89.16 44.91 88.68C43.27 88.21 41.67 87.47 40.16 86.72C38.65 85.96 37.24 85.02 35.86 84.13C34.48 83.24 33.19 82.29 31.89 81.37C30.58 80.46 29.32 79.56 28.03 78.63C26.74 77.71 25.44 76.82 24.16 75.84C22.88 74.86 21.57 73.87 20.36 72.74C19.15 71.62 17.95 70.42 16.91 69.1C15.88 67.79 14.92 66.35 14.15 64.85C13.38 63.35 12.76 61.73 12.29 60.1C11.81 58.48 11.52 56.78 11.29 55.1C11.06 53.41 10.98 51.71 10.91 50C10.83 48.29 10.83 46.59 10.83 44.84C10.84 43.1 10.85 41.34 10.93 39.53C11.02 37.72 11.09 35.86 11.34 33.99C11.59 32.12 11.88 30.16 12.43 28.31C12.99 26.46 13.69 24.56 14.66 22.88C15.64 21.21 16.86 19.58 18.27 18.27C19.69 16.96 21.4 15.84 23.17 15.03C24.93 14.22 26.95 13.71 28.89 13.43C30.83 13.15 32.9 13.21 34.82 13.36C36.74 13.5 38.66 13.92 40.43 14.28C42.2 14.65 43.87 15.16 45.46 15.54C47.06 15.93 48.52 16.31 50 16.58C51.48 16.85 52.87 17.02 54.32 17.17C55.77 17.32 57.22 17.36 58.71 17.49C60.2 17.62 61.74 17.7 63.28 17.95C64.81 18.19 66.39 18.5 67.91 18.98C69.43 19.46 70.95 20.08 72.38 20.83C73.81 21.58 75.19 22.5 76.5 23.5C77.81 24.5 79.03 25.63 80.22 26.81C81.41 27.99 82.54 29.25 83.65 30.57C84.76 31.89 85.85 33.26 86.89 34.72C87.93 36.18 88.98 37.69 89.9 39.31C90.82 40.92 91.73 42.64 92.4 44.42C93.07 46.2 93.66 48.1 93.92 50Z",
  ghost: "M17 50C17 31.78 31.78 17 50 17C68.22 17 83 31.78 83 50V81.5Q72 93.5 61 81.5Q50 93.5 39 81.5Q28 93.5 17 81.5Z",
  circle: "M50 8A42 42 0 1 1 50 92A42 42 0 1 1 50 8Z",
  drop: "M50 8.5C52.2 8.5 53.4 10.3 56.4 15.2C62.9 25.5 84 44.6 84 61.5C84 80.3 68.8 92 50 92C31.2 92 16 80.3 16 61.5C16 44.6 37.1 25.5 43.6 15.2C46.6 10.3 47.8 8.5 50 8.5Z",
  star: "M45.77 9.7A5 5 0 0 1 54.23 9.7L65.02 26.81A4 4 0 0 0 67.42 28.55L87.02 33.53A5 5 0 0 1 89.63 41.57L76.7 57.12A4 4 0 0 0 75.78 59.94L77.11 80.12A5 5 0 0 1 70.26 85.09L51.48 77.59A4 4 0 0 0 48.52 77.59L29.74 85.09A5 5 0 0 1 22.89 80.12L24.22 59.94A4 4 0 0 0 23.3 57.12L10.37 41.57A5 5 0 0 1 12.98 33.53L32.58 28.55A4 4 0 0 0 34.98 26.81L45.77 9.7Z",
  droid: "M16 50C16 38.95 24.95 30 36 30H64C75.05 30 84 38.95 84 50V70C84 81.05 75.05 90 64 90H36C24.95 90 16 81.05 16 70ZM4 62A7 7 0 1 1 18 62A7 7 0 1 1 4 62ZM82 62A7 7 0 1 1 96 62A7 7 0 1 1 82 62Z",
  mech: "M10 48C10 38.06 18.06 30 28 30H72C81.94 30 90 38.06 90 48V70C90 79.94 81.94 88 72 88H28C18.06 88 10 79.94 10 70ZM3 54C3 51.79 4.79 50 7 50H11V72H7C4.79 72 3 70.21 3 68ZM89 50H93C95.21 50 97 51.79 97 54V68C97 70.21 95.21 72 93 72H89Z",
  alien: "M50 10C70 10 83 27 83 46C83 65 64 92 50 92C36 92 17 65 17 46C17 27 30 10 50 10Z",
  hexagon: "M91.4 45.5A9 9 0 0 1 91.4 54.5L74.6 83.61A9 9 0 0 1 66.8 88.11L33.2 88.11A9 9 0 0 1 25.4 83.61L8.6 54.5A9 9 0 0 1 8.6 45.5L25.4 16.39A9 9 0 0 1 33.2 11.89L66.8 11.89A9 9 0 0 1 74.6 16.39L91.4 45.5Z",
  cat: "M50 20A36 36 0 1 1 50 92A36 36 0 1 1 50 20ZM24.72 44.64A4.5 4.5 0 0 1 17.35 40.67L20.21 16.66A4.5 4.5 0 0 1 26.86 13.26L42.3 21.83A4.5 4.5 0 0 1 43.02 29.21L24.72 44.64ZM82.65 40.67A4.5 4.5 0 0 1 75.28 44.64L56.98 29.21A4.5 4.5 0 0 1 57.7 21.83L73.14 13.26A4.5 4.5 0 0 1 79.79 16.66L82.65 40.67Z",
  cloud: "M19 44A25 25 0 1 1 69 44A25 25 0 1 1 19 44ZM47 50A21 21 0 1 1 89 50A21 21 0 1 1 47 50ZM7 68A17 17 0 1 1 41 68A17 17 0 1 1 7 68ZM32 73A18 18 0 1 1 68 73A18 18 0 1 1 32 73ZM60 70A16 16 0 1 1 92 70A16 16 0 1 1 60 70Z",
  pill: "M28 28H72C84.15 28 94 37.85 94 50C94 62.15 84.15 72 72 72H28C15.85 72 6 62.15 6 50C6 37.85 15.85 28 28 28Z",
  pebble: "M94.6 50C94.71 51.92 94.56 53.93 94.17 55.82C93.79 57.7 93.13 59.6 92.28 61.33C91.44 63.06 90.32 64.72 89.1 66.19C87.87 67.67 86.41 69.01 84.92 70.16C83.42 71.31 81.75 72.29 80.11 73.1C78.47 73.92 76.73 74.55 75.06 75.06C73.39 75.58 71.7 75.91 70.1 76.2C68.5 76.48 66.93 76.62 65.45 76.76C63.96 76.9 62.55 76.94 61.2 77.03C59.84 77.11 58.57 77.16 57.31 77.26C56.05 77.36 54.86 77.48 53.64 77.63C52.42 77.79 51.24 77.98 50 78.18C48.76 78.39 47.52 78.64 46.2 78.85C44.89 79.06 43.53 79.3 42.11 79.46C40.69 79.61 39.2 79.75 37.67 79.77C36.14 79.78 34.54 79.74 32.95 79.54C31.35 79.33 29.7 79.03 28.1 78.55C26.49 78.07 24.86 77.45 23.33 76.67C21.8 75.88 20.29 74.94 18.92 73.85C17.54 72.77 16.23 71.51 15.08 70.16C13.94 68.8 12.9 67.29 12.04 65.72C11.17 64.16 10.45 62.46 9.91 60.74C9.36 59.03 8.98 57.22 8.76 55.43C8.55 53.64 8.5 51.8 8.6 50C8.71 48.2 8.98 46.39 9.38 44.65C9.79 42.91 10.35 41.19 11.02 39.56C11.7 37.92 12.52 36.34 13.43 34.85C14.34 33.37 15.39 31.96 16.5 30.66C17.61 29.36 18.84 28.15 20.11 27.07C21.39 25.98 22.76 25 24.15 24.15C25.54 23.3 27.01 22.56 28.48 21.95C29.94 21.33 31.46 20.85 32.95 20.46C34.44 20.08 35.95 19.83 37.43 19.66C38.91 19.48 40.38 19.43 41.81 19.43C43.24 19.43 44.64 19.53 46.01 19.66C47.37 19.78 48.7 19.98 50 20.18C51.3 20.39 52.57 20.63 53.83 20.87C55.1 21.11 56.34 21.37 57.6 21.62C58.87 21.87 60.13 22.12 61.43 22.39C62.74 22.66 64.07 22.93 65.45 23.24C66.83 23.56 68.25 23.88 69.72 24.3C71.19 24.72 72.71 25.17 74.25 25.75C75.78 26.34 77.37 27 78.91 27.81C80.46 28.63 82.04 29.56 83.5 30.66C84.97 31.75 86.43 33 87.7 34.38C88.98 35.77 90.19 37.32 91.17 38.97C92.14 40.62 92.98 42.43 93.56 44.27C94.13 46.1 94.5 48.08 94.6 50Z",
  puddle: "M85.34 50C85.65 51.54 85.9 53.13 86.01 54.74C86.11 56.35 86.11 58 85.95 59.63C85.8 61.26 85.51 62.93 85.07 64.52C84.62 66.12 84.03 67.72 83.3 69.23C82.58 70.74 81.7 72.21 80.72 73.57C79.74 74.94 78.62 76.23 77.43 77.43C76.24 78.62 74.93 79.72 73.58 80.73C72.23 81.74 70.79 82.65 69.33 83.48C67.86 84.31 66.34 85.04 64.79 85.71C63.24 86.37 61.65 86.95 60.04 87.46C58.42 87.96 56.77 88.4 55.1 88.75C53.43 89.09 51.72 89.37 50 89.54C48.28 89.71 46.52 89.81 44.76 89.76C43.01 89.72 41.22 89.58 39.47 89.29C37.72 89 35.95 88.58 34.26 88C32.57 87.42 30.89 86.69 29.33 85.8C27.77 84.92 26.26 83.87 24.91 82.7C23.56 81.53 22.3 80.19 21.23 78.77C20.16 77.35 19.22 75.79 18.47 74.2C17.71 72.61 17.13 70.91 16.7 69.23C16.26 67.55 16.02 65.81 15.88 64.13C15.75 62.45 15.78 60.76 15.88 59.14C15.97 57.52 16.21 55.94 16.45 54.42C16.7 52.89 17.03 51.43 17.34 50C17.65 48.57 18 47.2 18.32 45.83C18.63 44.46 18.94 43.13 19.24 41.76C19.53 40.39 19.79 39.03 20.08 37.61C20.36 36.18 20.62 34.74 20.95 33.23C21.28 31.72 21.61 30.16 22.07 28.57C22.52 26.98 23.02 25.32 23.69 23.69C24.35 22.06 25.11 20.38 26.05 18.79C26.99 17.21 28.08 15.62 29.33 14.2C30.58 12.78 32 11.41 33.54 10.26C35.08 9.12 36.8 8.11 38.57 7.35C40.34 6.6 42.27 6.04 44.17 5.73C46.08 5.43 48.08 5.37 50 5.54C51.92 5.71 53.87 6.15 55.69 6.75C57.52 7.36 59.3 8.22 60.94 9.19C62.57 10.15 64.11 11.33 65.51 12.56C66.91 13.78 68.17 15.15 69.33 16.52C70.48 17.89 71.5 19.34 72.44 20.76C73.38 22.18 74.19 23.62 74.97 25.03C75.75 26.43 76.44 27.83 77.12 29.19C77.8 30.56 78.42 31.89 79.05 33.23C79.67 34.57 80.28 35.87 80.87 37.21C81.46 38.55 82.05 39.88 82.6 41.27C83.14 42.65 83.68 44.05 84.14 45.51C84.6 46.96 85.03 48.46 85.34 50Z"
}, oa = {
  droid: "M47.5 14H52.5V32H47.5ZM43 11A7 7 0 1 1 57 11A7 7 0 1 1 43 11Z",
  mech: "M19.5 32L24.5 32L17 13L12 13ZM75.5 32L80.5 32L88 13L83 13ZM10 11.5A4.5 4.5 0 1 1 19 11.5A4.5 4.5 0 1 1 10 11.5ZM81 11.5A4.5 4.5 0 1 1 90 11.5A4.5 4.5 0 1 1 81 11.5Z"
};
function p0(t) {
  const n = t.trim(), o = n.match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%/i);
  if (o) return uc([Number(o[1]) / 360, Number(o[2]) / 100, Number(o[3]) / 100]);
  const s = n.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (s) {
    let e = s[1];
    e.length === 3 && (e = e.split("").map((i) => i + i).join(""));
    const r = parseInt(e, 16);
    return [r >> 16 & 255, r >> 8 & 255, r & 255];
  }
  const a = n.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  return a ? [Number(a[1]), Number(a[2]), Number(a[3])] : null;
}
function cc(t) {
  const n = p0(t);
  if (!n) return 0.5;
  const o = (s) => {
    const a = s / 255;
    return a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * o(n[0]) + 0.7152 * o(n[1]) + 0.0722 * o(n[2]);
}
const ic = "#1E1A33", lc = "#F7F5F2";
function hc(t) {
  return cc(t) < 0.13 ? lc : ic;
}
function fc([t, n, o]) {
  t /= 255, n /= 255, o /= 255;
  const s = Math.max(t, n, o), a = Math.min(t, n, o), e = (s + a) / 2;
  if (s === a) return [0, 0, e];
  const r = s - a, i = e > 0.5 ? r / (2 - s - a) : r / (s + a);
  let l = 0;
  return s === t ? l = (n - o) / r + (n < o ? 6 : 0) : s === n ? l = (o - t) / r + 2 : l = (t - n) / r + 4, [l / 6, i, e];
}
function uc([t, n, o]) {
  if (n === 0) return [o * 255, o * 255, o * 255];
  const s = o < 0.5 ? o * (1 + n) : o + n - o * n, a = 2 * o - s, e = (r) => (r = (r % 1 + 1) % 1, r < 1 / 6 ? a + (s - a) * 6 * r : r < 1 / 2 ? s : r < 2 / 3 ? a + (s - a) * (2 / 3 - r) * 6 : a);
  return [e(t + 1 / 3) * 255, e(t) * 255, e(t - 1 / 3) * 255];
}
function dc([t, n, o]) {
  return `hsl(${(t * 360).toFixed(1)} ${(n * 100).toFixed(1)}% ${(o * 100).toFixed(1)}%)`;
}
const sa = (t) => Math.min(1, Math.max(0, t));
function un(t, n, o = 0) {
  const s = p0(t);
  if (!s) return t;
  const [a, e, r] = fc(s);
  return dc([a, sa(e + o + (n < 0 ? -n * 0.25 : 0)), sa(r + n)]);
}
const fe = (t) => t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4), pc = (t) => t <= 31308e-7 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055;
function Mc(t, n, o) {
  const s = Math.cbrt(0.4122214708 * t + 0.5363325363 * n + 0.0514459929 * o), a = Math.cbrt(0.2119034982 * t + 0.6806995451 * n + 0.1073969566 * o), e = Math.cbrt(0.0883024619 * t + 0.2817188376 * n + 0.6299787005 * o);
  return [0.2104542553 * s + 0.793617785 * a - 0.0040720468 * e, 1.9779984951 * s - 2.428592205 * a + 0.4505937099 * e, 0.0259040371 * s + 0.7827717662 * a - 0.808675766 * e];
}
function ea(t, n, o) {
  const s = Math.pow(t + 0.3963377774 * n + 0.2158037573 * o, 3), a = Math.pow(t - 0.1055613458 * n - 0.0638541728 * o, 3), e = Math.pow(t - 0.0894841775 * n - 1.291485548 * o, 3);
  return [4.0767416621 * s - 3.3077115913 * a + 0.2309699292 * e, -1.2684380046 * s + 2.6097574011 * a - 0.3413193965 * e, -0.0041960863 * s - 0.7034186147 * a + 1.707614701 * e];
}
const mc = (t) => t.every((n) => n >= -1e-4 && n <= 1 + 1e-4);
function yc(t, n) {
  const o = p0(t);
  if (!o || !(n > 0)) return t;
  const [s, a, e] = Mc(fe(o[0] / 255), fe(o[1] / 255), fe(o[2] / 255)), r = Math.hypot(a, e);
  if (r < 1e-4) return t;
  const i = a / r, l = e / r, h = r * (1 + 0.5 * n);
  let d = null, u = r;
  for (let f = 0; f <= 6; f++) {
    const b = s * (1 - 0.15 * n * f / 6);
    let M = 0, y = h;
    for (let m = 0; m < 18; m++) {
      const A = (M + y) / 2;
      mc(ea(b, i * A, l * A)) ? M = A : y = A;
    }
    if (M > u + 4e-3 * f && (u = M, d = ea(b, i * M, l * M)), M >= h - 1e-4) break;
  }
  if (!d) return t;
  const c = d.map((f) => Math.round(255 * pc(Math.min(1, Math.max(0, f)))));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}
const v0 = ["default", "working", "sleeping"], D0 = 0.68, lr = 26, gc = 0.2, aa = { height: lr, time: D0, stretch: 1, squash: 1.15, squashTime: 0.37, squashEase: "pulse", groundTime: 0.11, groundEase: "pulse", riseTime: 0.33, riseEase: "pulse", clickSquashTime: 0.24, spin: 1, lean: 6, every: 8, land: 0 }, hr = (t, n) => n ? t.clickSquashTime : gc * t.time, ue = (t, n) => hr(t, n) + t.time + fr[t.squashEase] * (n ? t.clickSquashTime : t.squashTime) + Math.max(0, t.groundTime) + t.riseTime + Math.max(0, t.land) + 0.05, fr = { sharp: 0, pulse: 2 / 7, soft: 0.5, bouncy: 0.144 }, ra = (t, n) => {
  if (t <= 0) return 1;
  if (t >= 1) return 0;
  switch (n) {
    case "sharp":
      return (1 - t) * (1 - t);
    case "soft":
      return 0.5 + 0.5 * Math.cos(Math.PI * t);
    case "bouncy":
      return Math.exp(-3.2 * t) * Math.cos(5.4 * t) - t * t * t * 0.026;
    default: {
      const o = 4.2 * t;
      return (1 + o) * Math.exp(-o) - t * t * t * 0.078;
    }
  }
}, ca = (t, n) => 1 + 0.25 * ur(t, n), ur = (t, n) => {
  if (t <= 0 || t >= 1) return 0;
  let o;
  switch (n) {
    case "sharp":
      o = (1 - t) * (1 - t);
      break;
    case "soft":
      o = Math.sin(Math.PI * t) ** 2;
      break;
    case "bouncy":
      o = Math.exp(-3.15 * t) * Math.sin(8.43 * t) / 0.596;
      break;
    default: {
      const a = 7 * t;
      o = a * a * Math.exp(2 - a) / 4;
    }
  }
  const s = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
  return o * s * s * (3 - 2 * s);
}, de = (t) => Math.exp(-Math.pow(Math.min(Math.abs(t), Math.abs(t - 1)) / 0.11, 2)), Bn = Math.PI / 180, ds = Math.PI * 2, bc = { default: 1.2, working: 0.7, sleeping: 1.4 }, Ac = 1;
function Cc(t) {
  let n = t * 2654435761 >>> 0 || 1;
  return () => {
    n = n + 1831565813 >>> 0;
    let o = n;
    return o = Math.imul(o ^ o >>> 15, o | 1), o ^= o + Math.imul(o ^ o >>> 7, o | 61), ((o ^ o >>> 14) >>> 0) / 4294967296;
  };
}
function Ps(t, n, o, s) {
  return t + (n - t) * (1 - Math.exp(-o * s));
}
const n0 = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, wc = (t) => 0.5 - 0.5 * Math.cos(Math.PI * t);
class o0 {
  /* A channel that picks a new target now and then and moves to it. The
     head channels move as a lightly damped spring — the turn starts and
     ends softly, the way a head does — while the eyes dart with an
     exponential approach, the way eyes do. */
  constructor(n, o, s, a, e, r = !1) {
    this.rand = n, this.amp = o, this.holdMin = s, this.holdMax = a, this.rate = e, this.spring = r, this.value = 0, this.vel = 0, this.target = 0, this.next = 0;
  }
  update(n, o) {
    if (n >= this.next && (this.target = (this.rand() * 2 - 1) * this.amp, this.next = n + this.holdMin + this.rand() * (this.holdMax - this.holdMin)), this.spring) {
      const s = this.rate * 1.6, a = 0.9;
      this.vel += (s * s * (this.target - this.value) - 2 * a * s * this.vel) * o, this.value += this.vel * o;
    } else this.value = Ps(this.value, this.target, this.rate, o);
  }
  /** aim at a value and stay there: the rig picks the next one */
  aim(n) {
    this.target = n, this.next = 1 / 0;
  }
  set(n, o, s, a) {
    this.amp = n, this.holdMin = o, this.holdMax = s, this.rate = a, this.next = 0;
  }
}
class s0 {
  constructor(n) {
    this.duration = n, this.p = -1;
  }
  fire() {
    this.p = 0;
  }
  get active() {
    return this.p >= 0;
  }
  update(n) {
    this.p < 0 || (this.p += n / this.duration, this.p >= 1 && (this.p = -1));
  }
}
const ia = 35 * Bn, la = 14 * Bn, ha = 3.2 * Bn, fa = 2.6, xc = 4.4, dr = {
  default: { pitch: 0, roll: 0, y: 0, lookX: 0, lookY: 0 },
  working: { pitch: 5 * Bn, roll: 0, y: 0, lookX: 0, lookY: 0 },
  sleeping: { pitch: -16 * Bn, roll: 6 * Bn, y: 3, lookX: 0, lookY: 1 }
};
class kc {
  constructor(n, o = "default") {
    this.pose = { yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, sx: 1, sy: 1, eyeOpen: 1, blinkL: 0, blinkR: 0, lookX: 0, lookY: 0, breath: 0, laugh: 0, whirl: 0, whirlAngle: 0, w: [1, 0, 0] }, this.state = "default", this.t = 0, this.wFrom = [1, 0, 0], this.tr = 1, this.trDuration = 1.2, this.blink = new s0(0.17), this.blinkAgain = !1, this.dart = new s0(0.12), this.dartX = 0, this.dartY = 0, this.flip = new s0(ue(aa, !1)), this.flipPoked = !1, this.jump = { ...aa }, this.flipSide = 1, this.nod = new s0(1.7), this.hopPhase = 0, this.hopCount = 0, this.hopGain = 0, this.laughEv = new s0(0.8), this.prevYaw = 0, this.jelly = 0, this.jellyV = 0, this.gazeLead = 0, this.gazeDir = [0, 0], this.gazeAt = 0, this.turnK = 1, this.breathPhase = 0, this.ptrX = 0, this.ptrY = 0, this.ptrS = 0, this.ptrTargetX = 0, this.ptrTargetY = 0, this.ptrTargetS = 0, this.baseYaw = 0, this.rand = Cc(Math.floor(n * 1e6) + 1);
    const s = this.rand;
    this.yawW = new o0(s, 36 * Bn, 1.1, 2.6, 3, !0), this.pitchW = new o0(s, 10 * Bn, 1.1, 2.6, 2.6, !0), this.rollW = new o0(s, 5 * Bn, 1.6, 3.2, 2, !0), this.lookXW = new o0(s, 3.6, 0.5, 2, 14), this.lookYW = new o0(s, 2.4, 0.5, 2, 14), this.t = s() * 10, this.hopPhase = s(), this.breathPhase = s(), this.blinkAt = this.t + 1 + s() * 3, this.flipAt = this.nextFlip(this.t, 1), this.nodAt = this.t + 3 + s() * 4, this.dartAt = this.t + 1 + s() * 2, this.laughAt = this.t + 0.6 + s() * 1.5, this.setState(o, !0);
  }
  setState(n, o = !1) {
    if (n === this.state && !o) return;
    const s = this.state;
    this.state = n;
    const a = this.pose.w;
    if (o) {
      for (let e = 0; e < 3; e++) a[e] = v0[e] === n ? 1 : 0;
      this.tr = 1;
    } else
      this.wFrom = [a[0], a[1], a[2]], this.tr = 0, this.trDuration = s === "sleeping" ? Ac : bc[n];
    switch (n) {
      case "default":
        this.yawW.set(ia, 2.6, 5.4, 2), this.pitchW.set(la, 2.8, 5.8, 1.8), this.rollW.set(ha, 3.4, 6.6, 1.5), this.gazeAt = 0, this.gazeDir = [0, 0], this.lookXW.set(3.6, 0.6, 2.2, 13), this.lookYW.set(2.4, 0.6, 2.2, 13), this.flipAt = this.nextFlip(this.t, 0.6);
        break;
      case "working":
        this.yawW.set(16 * Bn, 0.9, 1.8, 4), this.pitchW.set(3 * Bn, 1.2, 2.4, 3), this.rollW.set(0, 1, 2, 3), this.lookXW.set(2, 0.5, 1.2, 12), this.lookYW.set(1, 0.5, 1.2, 12), this.hopPhase = 0, this.hopCount = 0, this.laughAt = this.t + 0.5 + this.rand() * 1.2;
        break;
      case "sleeping":
        this.yawW.set(7 * Bn, 3, 6, 0.7), this.pitchW.set(3 * Bn, 3, 6, 0.7), this.rollW.set(2 * Bn, 3, 6, 0.6), this.lookXW.set(0, 2, 4, 2), this.lookYW.set(0, 2, 4, 2), this.nodAt = this.t + 2.5 + this.rand() * 4;
        break;
    }
  }
  /** Where the pointer is, relative to the head (−1 … 1 across a head
      width), and how strongly to follow it (0 lets go). */
  setPointer(n, o, s) {
    this.ptrTargetX = Math.max(-1.2, Math.min(1.2, n)), this.ptrTargetY = Math.max(-1.2, Math.min(1.2, o)), this.ptrTargetS = Math.max(0, Math.min(1, s));
  }
  /** A hop and a full turn, right now, whatever the state. */
  poke() {
    this.flip.active && this.flip.p < 0.6 || (this.flipPoked = !0, this.flip.duration = ue(this.jump, !0), this.flipSide = this.rand() < 0.5 ? -1 : 1, this.flip.fire(), this.flipAt = this.nextFlip(this.t, 1.1));
  }
  /** How far the head turns to the side while idle: 1 as the gaze has
      it, 0 keeps it facing forward. */
  setTurn(n) {
    const o = Math.max(0, n);
    o !== this.turnK && (this.turnK = o, this.state === "default" && (this.gazeAt = 0));
  }
  /** The jump's numbers; any subset. */
  setJump(n) {
    const o = this.jump.every;
    Object.assign(this.jump, n), n.every !== void 0 && n.every !== o && (this.flipAt = this.nextFlip(this.t, 1));
  }
  /* Where the head looks next. From a corner it mostly swings straight
     across to the opposite one — top right, stay, bottom left — now and
     then only sideways, or back to the middle for a beat. */
  nextGaze() {
    const n = this.rand, [o, s] = this.gazeDir;
    if (o !== 0 || s !== 0) {
      const e = n();
      return e < 0.66 ? [-o, -s] : e < 0.85 ? [-o, s] : [0, 0];
    }
    const a = [
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 1]
    ];
    return a[Math.floor(n() * a.length)];
  }
  /** when the next idle jump is due: `every` seconds, give or take 40 % */
  nextFlip(n, o) {
    const s = this.jump.every;
    return s > 0 ? n + s * o * (0.625 + this.rand() * 0.75) : 1 / 0;
  }
  /** Advance by `dt` seconds (already scaled by the speed). */
  update(n) {
    n = Math.min(n, 0.05), this.t += n;
    const o = this.t, s = this.pose, a = s.w;
    if (this.tr < 1) {
      this.tr = Math.min(1, this.tr + n / this.trDuration);
      const P = wc(this.tr);
      for (let q = 0; q < 3; q++) {
        const V = v0[q] === this.state ? 1 : 0;
        a[q] = this.wFrom[q] + (V - this.wFrom[q]) * P;
      }
    }
    const [e, r, i] = a, l = { pitch: 0, roll: 0, y: 0, lookX: 0, lookY: 0 };
    for (let P = 0; P < 3; P++) {
      const q = dr[v0[P]];
      l.pitch += q.pitch * a[P], l.roll += q.roll * a[P], l.y += q.y * a[P], l.lookX += q.lookX * a[P], l.lookY += q.lookY * a[P];
    }
    if (this.state === "default" && o >= this.gazeAt) {
      const [P, q] = this.nextGaze();
      this.gazeDir = [P, q];
      const V = 0.84 + this.rand() * 0.16;
      this.yawW.aim(P * ia * V * this.turnK), this.pitchW.aim(q * la * V), this.rollW.aim(P * ha * V * this.turnK), this.gazeAt = o + fa + this.rand() * (xc - fa);
    }
    this.yawW.update(o, n), this.pitchW.update(o, n), this.rollW.update(o, n), this.lookXW.update(o, n), this.lookYW.update(o, n), this.ptrS = Ps(this.ptrS, this.ptrTargetS, 8, n), this.ptrX = Ps(this.ptrX, this.ptrTargetX, 14, n), this.ptrY = Ps(this.ptrY, this.ptrTargetY, 14, n);
    const h = this.ptrS, d = 1 - 0.75 * h;
    this.baseYaw = Ps(this.baseYaw, this.yawW.value * d + 22 * Bn * this.ptrX * h, 5, n);
    const u = l.pitch + this.pitchW.value * d - 12 * Bn * this.ptrY * h, c = l.roll + this.rollW.value * d, f = l.y, b = l.lookX + this.lookXW.value * d + 4.5 * this.ptrX * h, M = l.lookY + this.lookYW.value * d + 3 * this.ptrY * h;
    let y = 0, m = 0, A = 1, g = 1, I = 0, x = 0, p = 0, k = 0, L = 0, S = 0, O = 0, F = 0;
    const W = (P, q, V) => {
      const bt = Math.min(1, Math.max(0, (V - P) / (q - P)));
      return bt * bt * (3 - 2 * bt);
    }, C = (P) => W(0.1, 0.26, P) * (1 - W(0.66, 0.9, P)), $ = (P) => ds * (1.5 * P + 0.9 * n0(P));
    if (o >= this.blinkAt && !this.blink.active && e + r > 0.5 && (this.blink.fire(), this.blinkAgain = !this.blinkAgain && this.rand() < 0.22, this.blinkAt = o + (this.blinkAgain ? 0.28 : 2.2 + this.rand() * 2.6)), this.blink.update(n), this.blink.active && (p = Math.sin(Math.PI * this.blink.p)), o >= this.dartAt && !this.dart.active && e + r > 0.5 && (this.dart.fire(), this.dartX = (this.rand() * 2 - 1) * 4, this.dartY = (this.rand() * 2 - 1) * 2, this.dart.duration = 0.25 + this.rand() * 0.45, this.dartAt = o + 1.2 + this.rand() * 2.6), this.dart.update(n), this.dart.active) {
      const P = this.dart.p, q = P < 0.15 ? P / 0.15 : P > 0.8 ? (1 - P) / 0.2 : 1;
      k += this.dartX * q * (e + r), L += this.dartY * q * (e + r);
    }
    if (this.state === "default" && o >= this.flipAt && !this.flip.active && (this.flipPoked = !1, this.flip.duration = ue(this.jump, !1), this.flipSide = this.rand() < 0.5 ? -1 : 1, this.flip.fire(), this.flipAt = this.nextFlip(o, 1)), this.flip.update(n), this.flip.active) {
      const P = this.jump, q = hr(P, this.flipPoked), V = (this.flip.p * this.flip.duration - q) / P.time, bt = Math.min(1, Math.max(0, V)), G = Math.sin(Math.PI * bt);
      y += ds * P.spin * n0(bt), m -= P.height * G;
      const N = (V - 1) * P.time - P.land, dt = this.flipPoked ? P.clickSquashTime : P.squashTime, at = (wt) => this.flipPoked ? wt * wt * (3 - 2 * wt) : de(wt - 1), At = Math.max(0, P.groundTime), D = fr[P.squashEase] * dt, ft = N - D - At, Yt = N <= D ? ur(N / dt, P.squashEase) : ft <= 0 ? ca((N - D) / At, P.groundEase) : ra(ft / P.riseTime, P.riseEase), _ = (V < 0 ? at(Math.max(0, 1 + V * P.time / q)) : N > 0 ? Yt : V < 0.2 ? de(V) : 0) * P.squash;
      A += 0.16 * _ - 0.06 * G * P.stretch, g += -0.18 * _ + 0.09 * G * P.stretch, x += this.flipSide * P.lean * Bn * G, P.spin > 0 && (S = Math.max(S, G), O = Math.max(O, C(bt)), F = $(bt));
    }
    const T = this.jump, E = Math.max(0, T.groundTime), z = E + T.riseTime;
    if (this.state === "working" && (this.hopGain = r), this.hopGain > 0.02 && (this.state === "working" || this.hopPhase > 0)) {
      this.hopPhase += n / D0, this.hopPhase >= 1 && (this.state === "working" ? (this.hopPhase -= 1, this.hopCount += 1) : (this.hopPhase - 1) * D0 >= z && (this.hopPhase = 0, this.hopGain = 0));
      const P = this.hopGain, q = Math.min(1, this.hopPhase), V = Math.sin(Math.PI * q), bt = this.hopCount % 3 === 2;
      m -= (bt ? lr : 18) * V * P;
      const N = this.state !== "working" && this.hopPhase > 1 ? (this.hopPhase - 1) * D0 : -1, dt = N < 0 ? de(this.hopPhase) : N < E ? ca(N / E, T.groundEase) : ra((N - E) / T.riseTime, T.riseEase);
      A += (0.16 * dt - 0.06 * V) * P, g += (-0.18 * dt + 0.09 * V) * P, bt && (y += ds * n0(q) * P, S = Math.max(S, V * P), C(q) * P > O && (O = C(q) * P, F = $(q))), x += (this.hopCount % 2 === 0 ? 1 : -1) * 6 * Bn * V * P;
    }
    if (this.state === "working" && o >= this.laughAt && !this.laughEv.active && (this.laughEv.fire(), this.laughEv.duration = 0.6 + this.rand() * 0.5, this.laughAt = o + 1.6 + this.rand() * 2.2), this.laughEv.update(n), this.laughEv.active) {
      const P = this.laughEv.p;
      S = Math.max(S, P < 0.18 ? P / 0.18 : P > 0.78 ? (1 - P) / 0.22 : 1);
    }
    if (this.state === "sleeping" && o >= this.nodAt && !this.nod.active && (this.nod.fire(), this.nodAt = o + 4 + this.rand() * 4), this.nod.update(n), this.nod.active) {
      const P = this.nod.p, q = P < 0.72 ? n0(P / 0.72) : 1 - n0((P - 0.72) / 0.28);
      I -= 13 * Bn * q * i;
    }
    this.breathPhase += n / (3.6 + 1.2 * i);
    const B = Math.sin(this.breathPhase * ds);
    s.breath = B, A += B * (8e-3 + 0.014 * i), g += B * (0.012 + 0.02 * i);
    const R = Math.sin(o * ds / 3.4) * 2 * (1 - i);
    s.yaw = this.baseYaw + y;
    let Y = this.baseYaw - this.prevYaw;
    Y = ((Y + Math.PI) % ds + ds) % ds - Math.PI, this.prevYaw = this.baseYaw;
    const et = n > 0 ? Math.abs(Y) / n : 0, ht = n > 0 ? Math.max(-2.2, Math.min(2.2, Y / n * 2.4)) : 0;
    this.gazeLead = Ps(this.gazeLead, ht, 9, n);
    const Et = Math.min(0.22, 0.055 * et), Pt = 16, Ot = 0.45;
    this.jellyV += (Pt * Pt * (Et - this.jelly) - 2 * Ot * Pt * this.jellyV) * n, this.jelly += this.jellyV * n;
    const Gt = Math.max(-0.08, Math.min(0.28, this.jelly)) * 0.6;
    A *= 1 + Gt, g *= 1 - 0.55 * Gt, s.pitch = u + I, s.roll = c + x, s.x = 0, s.y = f + m + R, s.sx = A, s.sy = g, s.eyeOpen = 1, s.laugh = Ps(s.laugh, S, 30, n), s.blinkL = p, s.blinkR = p, s.lookX = b + k + this.gazeLead, s.lookY = M + L, s.whirl = O, s.whirlAngle = F;
  }
}
function ua(t) {
  const n = dr[t];
  return {
    yaw: 0,
    pitch: n.pitch,
    roll: n.roll,
    x: 0,
    y: n.y,
    sx: 1,
    sy: 1,
    eyeOpen: 1,
    blinkL: 0,
    blinkR: 0,
    lookX: n.lookX,
    lookY: n.lookY,
    breath: 0,
    laugh: 0,
    whirl: 0,
    whirlAngle: 0,
    w: v0.map((o) => o === t ? 1 : 0)
  };
}
const ot = 3, Tt = 100 + 2 * ot, jn = 64, gi = jn, _0 = jn * jn, Do = 24, pr = 1e12, Mr = 48 * Math.PI / 180, da = Math.cos(Mr), Sc = Math.sin(Mr);
function pa(t, n, o, s, a, e) {
  let r = 0;
  a[0] = 0, e[0] = -1e30, e[1] = 1e30;
  for (let i = 1; i < n; i++) {
    let l = 0;
    for (; ; ) {
      const h = a[r];
      if (l = (t[i] + i * i - t[h] - h * h) / (2 * (i - h)), l > e[r]) break;
      r--;
    }
    r++, a[r] = i, e[r] = l, e[r + 1] = 1e30;
  }
  r = 0;
  for (let i = 0; i < n; i++) {
    for (; e[r + 1] < i; ) r++;
    const l = a[r];
    o[i] = (i - l) * (i - l) + t[l], s[i] = l;
  }
}
function Oe(t, n, o, s, a) {
  const e = new Float32Array(o), r = new Float32Array(o), i = new Int32Array(o), l = new Int32Array(o), h = new Float32Array(o + 1), d = new Float32Array(o * o), u = new Int32Array(o * o);
  for (let c = 0; c < o; c++) {
    for (let f = 0; f < o; f++) e[f] = t[f * o + c] === n ? 0 : pr;
    pa(e, o, r, i, l, h);
    for (let f = 0; f < o; f++)
      d[f * o + c] = r[f], u[f * o + c] = i[f];
  }
  for (let c = 0; c < o; c++) {
    const f = c * o;
    for (let b = 0; b < o; b++) e[b] = d[f + b];
    pa(e, o, r, i, l, h);
    for (let b = 0; b < o; b++)
      s[f + b] = r[b], a && (a[f + b] = u[f + i[b]] * o + i[b]);
  }
}
function pe(t, n, o) {
  for (let s = 0; s < n; s++) {
    const a = s * n;
    for (let e = 0; e < n; e++) {
      const r = e < 2 ? 0 : e - 2, i = e < 1 ? 0 : e - 1, l = e > n - 2 ? n - 1 : e + 1, h = e > n - 3 ? n - 1 : e + 2;
      o[a + e] = (t[a + r] + 4 * t[a + i] + 6 * t[a + e] + 4 * t[a + l] + t[a + h]) * 0.0625;
    }
  }
  for (let s = 0; s < n; s++)
    for (let a = 0; a < n; a++) {
      const e = a < 2 ? 0 : a - 2, r = a < 1 ? 0 : a - 1, i = a > n - 2 ? n - 1 : a + 1, l = a > n - 3 ? n - 1 : a + 2;
      t[a * n + s] = (o[e * n + s] + 4 * o[r * n + s] + 6 * o[a * n + s] + 4 * o[i * n + s] + o[l * n + s]) * 0.0625;
    }
}
function Ic(t, n, o) {
  const s = [];
  for (let e = n, r = 1; r <= 4 && e % 2 === 0 || r === 1; e >>= 1, r <<= 1) {
    const i = new Uint8Array(e * e);
    for (let l = 0; l < e; l++)
      for (let h = 0; h < e; h++) {
        let d = 0;
        for (let u = 0; u < r; u++) for (let c = 0; c < r; c++) d += t[(l * r + u) * n + h * r + c];
        i[l * e + h] = d >= 128 * r * r ? 1 : 0;
      }
    if (s.push({ n: e, mask: i, phi: new Float32Array(e * e) }), r === 4) break;
  }
  const a = (e, r, i, l) => {
    const { n: h, mask: d, phi: u } = e, c = r * r;
    for (let f = 0; f < i; f++)
      for (let b = 1; b < h - 1; b++) {
        const M = b * h;
        for (let y = 1; y < h - 1; y++) {
          const m = M + y;
          if (!d[m]) continue;
          const A = (u[m - 1] + u[m + 1] + u[m - h] + u[m + h] + c) * 0.25;
          u[m] += l * (A - u[m]);
        }
      }
  };
  for (let e = s.length - 1; e >= 0; e--) {
    const r = s[e], i = 1 << e;
    if (e < s.length - 1) {
      const h = s[e + 1], d = r.n, u = h.n;
      for (let c = 0; c < d; c++) {
        const f = Math.min(u - 1, Math.max(0, (c + 0.5) / 2 - 0.5)), b = f | 0, M = Math.min(u - 1, b + 1), y = f - b;
        for (let m = 0; m < d; m++) {
          const A = c * d + m;
          if (!r.mask[A]) continue;
          const g = Math.min(u - 1, Math.max(0, (m + 0.5) / 2 - 0.5)), I = g | 0, x = Math.min(u - 1, I + 1), p = g - I;
          r.phi[A] = (h.phi[b * u + I] * (1 - p) + h.phi[b * u + x] * p) * (1 - y) + (h.phi[M * u + I] * (1 - p) + h.phi[M * u + x] * p) * y;
        }
      }
    }
    const l = Math.min(1.9, 2 / (1 + Math.sin(Math.PI / r.n)) - 0.05);
    a(r, o * i, 4, 1), a(r, o * i, e === 2 ? 100 : e === 1 ? 30 : 16, l), a(r, o * i, 8, 1);
  }
  return s[0].phi;
}
const Tc = [1, 1, 0, -1, -1, -1, 0, 1], Pc = [0, 1, 1, 1, 0, -1, -1, -1], Fc = [1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2];
function Lc(t, n, o) {
  const s = Tt / n, a = n * n, e = new Uint8Array(a);
  for (let S = 0; S < a; S++) e[S] = t[S] >= 128 ? 1 : 0;
  const r = new Float32Array(a), i = new Float32Array(a), l = new Int32Array(a);
  Oe(e, 0, n, r, null), Oe(e, 1, n, i, l);
  const h = new Float32Array(a), d = new Float32Array(a);
  for (let S = 0; S < a; S++) {
    const O = t[S] / 255;
    h[S] = s * (O > 0 && O < 1 ? O - 0.5 : e[S] ? Math.sqrt(r[S]) - 0.5 : 0.5 - Math.sqrt(i[S]));
  }
  pe(h, n, d), pe(h, n, d);
  const u = Ic(t, n, s);
  let c = 0;
  for (let S = 0; S < a; S++) u[S] > c && (c = u[S]);
  const f = 2 * Math.sqrt(c), b = Math.min(1.5 * o + 0.32 * f, 1.4 * f), M = c > 0 ? b / Math.sqrt(c) : 0, y = new Float32Array(a);
  for (let S = 0; S < a; S++) y[S] = u[S] > 0 ? M * Math.sqrt(u[S]) : 0;
  pe(y, n, d);
  const m = { N: n, i00: new Uint16Array(a), wx: new Uint8Array(a), wy: new Uint8Array(a), ao: new Uint8Array(a), sd: h, h: y }, { i00: A, wx: g, wy: I, ao: x } = m, p = n <= 64 ? [1, 2, 3, 5, 8] : n <= 96 ? [1, 2, 4, 7, 11] : [1, 2, 4, 7, 11, 15], k = 64, L = n - 1;
  for (let S = 0; S < n; S++)
    for (let O = 0; O < n; O++) {
      const F = S * n + O, W = e[F] ? F : i[F] <= k ? l[F] : -1;
      if (W < 0) continue;
      const C = W % n, $ = (W - C) / n, T = C > 0 ? C - 1 : 0, E = C < L ? C + 1 : L, z = $ > 0 ? $ - 1 : 0, B = $ < L ? $ + 1 : L;
      let R = -(y[$ * n + E] - y[$ * n + T]) / (2 * s), Y = -(y[B * n + C] - y[z * n + C]) / (2 * s), et = 1, ht = Math.sqrt(R * R + Y * Y + 1);
      R /= ht, Y /= ht, et /= ht;
      const Et = Math.max(0, h[W]);
      if (Et < 2) {
        let dt = h[$ * n + E] - h[$ * n + T], at = h[B * n + C] - h[z * n + C];
        const At = Math.hypot(dt, at) || 1;
        dt /= At, at /= At;
        const D = 0.7 * (1 - Et / 2);
        R += D * (-dt - R), Y += D * (-at - Y), et += D * (0 - et), ht = Math.sqrt(R * R + Y * Y + et * et) || 1, R /= ht, Y /= ht, et /= ht;
      }
      const Pt = y[W];
      let Ot = 0;
      for (let dt = 0; dt < 8; dt++) {
        let at = 0;
        for (let At = 0; At < p.length; At++) {
          const D = p[At];
          let ft = C + Tc[dt] * D, Yt = $ + Pc[dt] * D;
          ft < 0 ? ft = 0 : ft > L && (ft = L), Yt < 0 ? Yt = 0 : Yt > L && (Yt = L);
          const _ = (y[Yt * n + ft] - Pt) / (D * s * Fc[dt]);
          _ > at && (at = _);
        }
        Ot += at / Math.sqrt(1 + at * at);
      }
      const Gt = 1 - Math.min(1, Et / 3), P = 1 - 0.2 * Gt * Gt, q = Math.pow(1 - 0.9 * Ot / 8, 1.5) * P;
      x[F] = Math.max(1, Math.round(255 * Math.pow(q, 1 / 2.2)));
      const V = (R * 0.5 + 0.5) * (jn - 1), bt = (Y * 0.5 + 0.5) * (jn - 1), G = Math.min(jn - 2, Math.max(0, V | 0)), N = Math.min(jn - 2, Math.max(0, bt | 0));
      A[F] = N * jn + G, g[F] = Math.round(255 * Math.min(1, Math.max(0, V - G))), I[F] = Math.round(255 * Math.min(1, Math.max(0, bt - N)));
    }
  return m;
}
function En(t) {
  if (typeof OffscreenCanvas == "function") return new OffscreenCanvas(t, t);
  if (typeof document < "u") {
    const n = document.createElement("canvas");
    return n.width = n.height = t, n;
  }
  return null;
}
function kn(t, n) {
  return t.getContext("2d", n ? { willReadFrequently: !0 } : void 0);
}
function mr(t, n) {
  const o = En(n), s = o && kn(o, !0);
  if (!s) return null;
  const a = Tt / n;
  s.setTransform(1 / a, 0, 0, 1 / a, ot / a, ot / a), s.fillStyle = "#fff", s.fill(t);
  const e = s.getImageData(0, 0, n, n).data, r = new Uint8ClampedArray(n * n);
  for (let i = 0; i < n * n; i++) r[i] = e[i * 4 + 3];
  return r;
}
const Fs = /* @__PURE__ */ new Map(), z0 = /* @__PURE__ */ new Set(), Ma = /* @__PURE__ */ new WeakMap();
let $c = 0;
function Me(t) {
  let n = Ma.get(t);
  return n || Ma.set(t, n = `p${$c++}`), n;
}
const r0 = [];
let We = !1;
const Ec = 6, me = () => typeof performance < "u" ? performance.now() : Date.now(), Oc = 20;
let l0 = 0;
function R0(t) {
  We = !1;
  const n = me();
  let o = r0.shift();
  for (; o && (o(), !((l0 > 0 ? Oc - (me() - n) : t && !t.didTimeout ? t.timeRemaining() - 6 : Ec - (me() - n)) <= 0)); )
    o = r0.shift();
  r0.length && yr();
}
function yr() {
  if (We) return;
  if (We = !0, l0 > 0) {
    setTimeout(() => R0(), 0);
    return;
  }
  const t = globalThis.requestIdleCallback;
  t ? t(R0, { timeout: 60 }) : setTimeout(() => R0(), 24);
}
function k0(t) {
  l0 = Math.max(0, l0 + (t ? 1 : -1)), t && r0.length && setTimeout(() => R0(), 0);
}
function H0() {
  return z0.size > 0 || Ls.size > 0;
}
function _e(t) {
  r0.push(t), yr();
}
const B0 = /* @__PURE__ */ new Set();
let j0 = !1, ye = !1;
function gr() {
  ye || !B0.size || (ye = !0, setTimeout(() => {
    ye = !1;
    for (const t of [...B0]) t();
  }, 0));
}
function ge(t) {
  return B0.add(t), () => {
    B0.delete(t);
  };
}
function S0() {
  const t = j0;
  return j0 = !1, t;
}
function br(t, n, o, s, a) {
  const e = `${t}|${o}|${Math.round(s)}`, r = Fs.get(e);
  if (r) return r;
  const i = () => {
    if (z0.delete(e), Fs.has(e)) return;
    const l = mr(n, o);
    l && (Fs.size >= 48 && Fs.clear(), Fs.set(e, Lc(l, o, s)), gr());
  };
  return a ? (i(), Fs.get(e) ?? null) : (z0.has(e) || (z0.add(e), _e(i)), j0 = !0, null);
}
function Wc(t, n, o = 192, s = 0.65, a = !1, e = bs, r = 295, i) {
  const l = br(t, n, Ar(o), 15 * s, !0);
  if (a && l) {
    const h = r * Math.PI / 180;
    Re(l, t, 15 * s, Math.ceil(Tt * o / 100), !1, Math.sin(h), -Math.cos(h), e, i ?? M0(Math.sin(h), -Math.cos(h)));
  }
}
function Ar(t) {
  return t <= 100 ? 64 : t <= 224 ? 96 : 128;
}
const ma = /* @__PURE__ */ new WeakMap();
function qc(t, n, o) {
  const s = Math.max(0.05, Math.min(1, o)), a = `${n}|${s.toFixed(2)}`;
  let e = ma.get(t);
  e || ma.set(t, e = /* @__PURE__ */ new Map());
  const r = e.get(a);
  if (r) return r;
  const { N: i, h: l, sd: h } = t;
  let d = 0;
  for (let p = 0; p < i * i; p++) l[p] > d && (d = l[p]);
  const u = Tt / i, c = new Float32Array(n), f = new Float32Array(n), b = new Float32Array(n), M = new Float32Array(n), y = new Float32Array(n);
  y[0] = 1.2;
  const m = (p) => {
    let k = 0, L = 0, S = 0;
    for (let O = 0, F = 0; O < i; O++) for (let W = 0; W < i; W++, F++) p(F) && (k += 1, L += W, S += O);
    return k ? [k, (L / k + 0.5) * u - ot, (S / k + 0.5) * u - ot] : [0, 50, 50];
  }, [A, g, I] = m((p) => h[p] >= 0);
  f[0] = 1, b[0] = g, M[0] = I;
  for (let p = 1; p < n; p++) {
    const k = p / n;
    c[p] = d * k;
    const L = d * Math.pow(k, 1 / s), [S, O, F] = m((T) => h[T] >= 0 && l[T] >= L);
    f[p] = Math.min(f[p - 1], A ? Math.sqrt(S / A) : 1), b[p] = O, M[p] = F;
    const W = d / (2 * n);
    let C = 0, $ = 0;
    for (let T = 0; T < i * i; T++)
      h[T] > 0 && Math.abs(l[T] - L) < W && ($ += h[T], C++);
    y[p] = Math.max(y[p - 1], C ? $ / C : y[p - 1]);
  }
  const x = { top: d, z: c, q: s, scale: f, cx: b, cy: M, inset: y };
  return e.size > 6 && e.clear(), e.set(a, x), x;
}
function vc(t, n, o, s, a = 1) {
  const e = `${t}|`, r = `|${Math.round(n)}`;
  let i = null;
  for (const [x, p] of Fs) x.startsWith(e) && x.endsWith(r) && (i = p);
  if (!i) return null;
  const { N: l, h } = i, d = Tt / l, u = Math.min(l - 1, Math.max(0, (o + ot) / d - 0.5)), c = Math.min(l - 1, Math.max(0, (s + ot) / d - 0.5)), f = Math.min(l - 2, u | 0), b = Math.min(l - 2, c | 0), M = u - f, y = c - b, m = b * l + f, A = (h[m] * (1 - M) + h[m + 1] * M) * (1 - y) + (h[m + l] * (1 - M) + h[m + l + 1] * M) * y;
  let g = 0;
  for (let x = 0; x < l * l; x++) h[x] > g && (g = h[x]);
  if (g <= 0) return 0;
  const I = Math.max(0.05, Math.min(1, a));
  return g * Math.pow(Math.max(0, A) / g, I);
}
const be = (t) => t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4), I0 = /* @__PURE__ */ new Map();
function Os(t) {
  let n = I0.get(t);
  if (!n) {
    let o = p0(t);
    if (!o) {
      const s = En(1), a = s && kn(s, !0);
      if (a) {
        a.fillStyle = t, a.fillRect(0, 0, 1, 1);
        const e = a.getImageData(0, 0, 1, 1).data;
        o = [e[0], e[1], e[2]];
      } else o = [128, 128, 128];
    }
    n = [be(o[0] / 255), be(o[1] / 255), be(o[2] / 255)], I0.size > 200 && I0.clear(), I0.set(t, n);
  }
  return n;
}
const Q0 = 2048, Cr = 2.5, wr = Q0 / Cr, xr = new Float32Array(Q0);
for (let t = 0; t < Q0; t++) {
  const n = (t + 0.5) / wr, o = n <= 0.75 ? n : 0.75 + 0.25 * (1 - Math.exp(-(n - 0.75) / 0.25));
  xr[t] = 255 * (o <= 31308e-7 ? 12.92 * o : 1.055 * Math.pow(o, 1 / 2.4) - 0.055);
}
const Ae = (t) => xr[t <= 0 ? 0 : t >= Cr ? Q0 - 1 : t * wr | 0], io = (t) => t <= 0 ? 0 : t >= 1 ? 255 : 255 * (t <= 31308e-7 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055), Ks = 1024, T0 = /* @__PURE__ */ new Map();
function Z0(t) {
  let n = T0.get(t);
  if (!n) {
    n = new Float32Array(Ks + 1);
    for (let o = 0; o <= Ks; o++) n[o] = Math.pow(o / Ks, t);
    T0.size > 16 && T0.clear(), T0.set(t, n);
  }
  return n;
}
function kr(t, n, o = 1 / 0) {
  if (!(n > 0)) return;
  const s = 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2], a = Math.min(t[0], t[1], t[2]), e = Math.max(t[0], t[1], t[2]);
  let r = 1 + 3 * n;
  a < s && (r = Math.min(r, s / (s - a))), e > s && (r = Math.min(r, Math.max(1, (o - s) / (e - s)))), t[0] = s + (t[0] - s) * r, t[1] = s + (t[1] - s) * r, t[2] = s + (t[2] - s) * r;
}
const Ce = [0.92, 0.96, 1], we = [1, 0.98, 0.95], mn = (t, n, o) => {
  const s = o <= t ? 0 : o >= n ? 1 : (o - t) / (n - t);
  return s * s * (3 - 2 * s);
}, ya = (t, n, o) => 1 - mn(t - n, t + n, o);
function Dc(t, n, o, s) {
  const { L: a, V: e, H: r, U: i, W: l, A: h, B: d } = o, u = s.vivid ?? 0, c = [0, 0, 0], f = Math.max(n[0], n[1], n[2], 0.05), b = [n[0] / f, n[1] / f, n[2] / f], M = Math.max(0.03, 0.3 - 0.15 * s.shadow), y = 0.15 + 0.14 * s.spread, m = 0.85, A = Math.min(90, Math.round(110 / Math.pow(s.spread, 1.3))), g = Math.max(2, Math.round(8 / s.spread)), I = Z0(A), x = Z0(g), p = 0.45 * s.highlight, k = 0.1 * s.highlight, L = 0.11 * s.highlight, S = 0.3 * s.rim, O = [M * b[0], M * b[1], M * b[2]];
  for (let F = 0; F < jn; F++)
    for (let W = 0; W < jn; W++) {
      let C = W / (jn - 1) * 2 - 1, $ = F / (jn - 1) * 2 - 1, T = C * C + $ * $;
      if (T > 1.14) continue;
      if (T > 1) {
        const At = 1 / Math.sqrt(T);
        C *= At, $ *= At, T = 1;
      }
      const E = Math.sqrt(1 - T), z = C * a[0] + $ * a[1] + E * a[2], B = Math.max(0, C * e[0] + $ * e[1] + E * e[2]), R = Math.max(0, C * r[0] + $ * r[1] + E * r[2]), Y = Math.min(1, Math.max(0, (z + y) / (1 + y))), et = 1 - B, ht = et * et, Et = ht * et, Pt = Et * ht, Ot = R * Ks | 0, Gt = (p * I[Ot] + k * x[Ot]) * (1 + 3 * Pt), P = 2 * B * C - e[0], q = 2 * B * $ - e[1], V = 2 * B * E - e[2], bt = 0.45 + 0.55 * mn(-0.4, 0.6, P * i[0] + q * i[1] + V * i[2]), G = P * l[0] + q * l[1] + V * l[2];
      let N = 0;
      if (G > 0.5) {
        const At = (P * h[0] + q * h[1] + V * h[2]) / G, D = (P * d[0] + q * d[1] + V * d[2]) / G;
        N = ya(0.34, 0.12, Math.abs(At)) * ya(0.12, 0.06, Math.abs(D));
      }
      const dt = S * Et * bt + L * N, at = (F * jn + W) * 3;
      c[0] = n[0] * (O[0] + m * Y), c[1] = n[1] * (O[1] + m * Y), c[2] = n[2] * (O[2] + m * Y), kr(c, u), t[at] = Ae(c[0] + Gt * we[0] + dt * Ce[0]), t[at + 1] = Ae(c[1] + Gt * we[1] + dt * Ce[1]), t[at + 2] = Ae(c[2] + Gt * we[2] + dt * Ce[2]);
    }
}
const ga = /* @__PURE__ */ new WeakMap();
function _c(t) {
  let n = ga.get(t);
  if (n) return n;
  const { N: o, sd: s, ao: a } = t;
  n = { ao: new Uint8Array(o * o), k: new Float32Array(o * o) };
  for (let e = 0; e < o * o; e++) {
    if (a[e] === 0) continue;
    const r = Math.max(0, s[e]), i = 1 - Math.min(1, r / 3), l = 1 - 0.2 * i * i, h = Math.min(1, Math.pow(a[e] / 255, 2.2) / l);
    n.ao[e] = Math.max(1, Math.round(255 * Math.pow(h, 1 / 2.2))), n.k[e] = 1;
  }
  return ga.set(t, n), n;
}
const Sr = 5;
function zc(t, n, o, s, a) {
  const { N: e, i00: r, wx: i, wy: l, ao: h, sd: d } = t, u = jn * 3;
  for (let c = 0, f = 0; c < e * e; c++, f += 4) {
    const b = h[c];
    if (b === 0) {
      o[f + 3] = 0;
      continue;
    }
    let M = a ? s[a.ao[c]] * a.k[c] : s[b];
    const y = r[c] * 3, m = i[c] * (1 / 255), A = l[c] * (1 / 255);
    if (a) {
      const L = (n[y + 1] * (1 - m) + n[y + 4] * m) * (1 - A) + (n[y + u + 1] * (1 - m) + n[y + u + 4] * m) * A;
      M = 1 - (1 - M) * (1.1 - 0.75 * Math.min(1, L / 235));
    }
    const g = (1 - m) * (1 - A) * M, I = m * (1 - A) * M, x = (1 - m) * A * M, p = m * A * M;
    o[f] = n[y] * g + n[y + 3] * I + n[y + u] * x + n[y + u + 3] * p, o[f + 1] = n[y + 1] * g + n[y + 4] * I + n[y + u + 1] * x + n[y + u + 4] * p, o[f + 2] = n[y + 2] * g + n[y + 5] * I + n[y + u + 2] * x + n[y + u + 5] * p;
    const k = d[c] / Sr;
    o[f + 3] = k >= 1 ? 255 : k <= 0 ? 0 : Math.round(255 * k * k * (3 - 2 * k));
  }
}
const ba = /* @__PURE__ */ new WeakMap();
function Rc(t, n) {
  let o = ba.get(t);
  if (o || ba.set(t, o = /* @__PURE__ */ new Map()), o.has(n)) return o.get(n);
  const s = En(n), a = s && kn(s, !1);
  if (!s || !a)
    return o.set(n, null), null;
  const { N: e, sd: r } = t, i = new ImageData(n, n), l = n / Tt;
  for (let h = 0; h < n; h++)
    for (let d = 0; d < n; d++) {
      const c = (ys(r, e, (d + 0.5) / l / Tt * e - 0.5, (h + 0.5) / l / Tt * e - 0.5) + 0.2) / 0.6, f = (h * n + d) * 4;
      i.data[f] = i.data[f + 1] = i.data[f + 2] = 255, i.data[f + 3] = c >= 1 ? 255 : c <= 0 ? 0 : Math.round(255 * c * c * (3 - 2 * c));
    }
  return a.putImageData(i, 0, 0), o.set(n, s), s;
}
const Aa = /* @__PURE__ */ new WeakMap();
function J0(t) {
  let n = Aa.get(t);
  if (n) return n;
  const { N: o, sd: s } = t, a = Tt / o, e = [];
  for (let r = 0, i = 0; r < o; r++) for (let l = 0; l < o; l++, i++) s[i] >= 0 && s[i] < 2 * a && e.push((l + 0.5) * a - ot, (r + 0.5) * a - ot, s[i]);
  return n = Float32Array.from(e), Aa.set(t, n), n;
}
const Ca = /* @__PURE__ */ new WeakMap();
function Hc(t) {
  let n = Ca.get(t);
  if (n) return n;
  const o = J0(t), s = [];
  let a = 0, e = 0;
  for (let l = 0; l < o.length; l += 3) a += o[l], e += o[l + 1];
  a /= o.length / 3 || 1, e /= o.length / 3 || 1;
  for (let l = 0; l < o.length; l += 3) s.push([o[l], o[l + 1], Math.atan2(o[l + 1] - e, o[l] - a), o[l + 2]]);
  s.sort((l, h) => l[2] - h[2]);
  const r = Math.max(1, Math.floor(s.length / 96)), i = s.filter((l, h) => h % r === 0);
  return n = { x: Float32Array.from(i, (l) => l[0]), y: Float32Array.from(i, (l) => l[1]), d: Float32Array.from(i, (l) => l[3]) }, Ca.set(t, n), n;
}
function wa(t, n, o) {
  const s = Math.round((n + Math.PI) / (2 * Math.PI) * t), a = o & 1 ? o + 1 >> 1 : -(o >> 1);
  return ((s + a) % t + t) % t;
}
function V0(t, n, o) {
  let s = -pr;
  for (let a = 0; a < t.length; a += 3) {
    const e = t[a] * n + t[a + 1] * o + t[a + 2];
    e > s && (s = e);
  }
  return s;
}
const Zo = /* @__PURE__ */ new Map(), Ls = /* @__PURE__ */ new Set(), Ir = (t, n) => Math.round(Math.atan2(n, t) / (Math.PI / 12)), Tr = (t) => t <= 200 ? 192 : t <= 360 ? 320 : 512, bs = { length: 1, density: 1.6, fuzz: 0.9, clumps: 0.4, curl: 0.7, gravity: 0.9 }, Yc = (t) => `${t.length.toFixed(2)},${t.density.toFixed(2)},${t.fuzz.toFixed(2)},${t.clumps.toFixed(2)},${t.curl.toFixed(2)},${(t.gravity ?? bs.gravity).toFixed(2)}`, Pr = (t, n, o, s, a, e) => `${t}|${Math.round(n)}|${o}|${s}|${Yc(a)}|${f1(e)}`, xa = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Set(), Jo = 128, Xc = 3.2, ke = 1 / 2.56, Se = 1 / (2 / 3 * Math.sqrt(1 / 3)), Kc = 0.6, ka = 0.07, Sa = 0.14, Ia = 0.3, Gc = 0.6, Bc = 0.35, jc = 0.3, Ta = 0.3, Zc = 1.26, Vc = 1.6, Nc = 0.045, Fr = 0.5, P0 = Math.cos(Fr), Pa = Math.sin(Fr), Uc = 0.22, Qc = 0.5, Lr = 0.36, Jc = 1.1, Fa = 1.625, t1 = 0.5, n1 = 0.9, F0 = 0.7, o1 = 0.15, s1 = 1.3, vo = 20, Vn = Tt + 2 * vo, e1 = 0.8, a1 = 0.3, r1 = 0.8, c1 = 0.7, i1 = 0.5, e0 = 2.5, Ie = 1.2, qe = 3, l1 = 0.8, h1 = 0.3, La = 0.1, c0 = 32 * Math.PI / 180, N0 = 1;
function $r(t, n, o = c0) {
  const s = Math.cos(o), a = Math.sin(o);
  return ss([t[0] * s + n[0] * a, t[1] * s + n[1] * a, t[2] * s + n[2] * a]);
}
function Er(t, n) {
  return ss([0.94 * t[0] - 0.34 * n[0], 0.94 * t[1] - 0.34 * n[1], 0.94 * t[2] - 0.34 * n[2]]);
}
function ze(t, n) {
  const o = -0.5 * t, s = -0.5 * n - 0.87, a = Math.hypot(o, s) || 1;
  return [o / a, s / a];
}
const M0 = (t, n) => {
  const [o, s] = ze(t, n);
  return { bx: o, by: s, front: c0 };
}, f1 = (t) => `${Math.round(Math.atan2(t.by, t.bx) / (Math.PI / 36))}|${Math.round(t.front / (Math.PI / 90))}`;
function Y0(t, n) {
  let o = t * 374761393 + n * 668265263 | 0;
  return o = Math.imul(o ^ o >>> 13, 1274126177), ((o ^ o >>> 16) >>> 0) / 4294967296;
}
function ys(t, n, o, s) {
  const a = n - 1, e = Math.min(a, Math.max(0, o)), r = Math.min(a, Math.max(0, s)), i = Math.min(a - 1, e | 0), l = Math.min(a - 1, r | 0), h = e - i, d = r - l, u = l * n + i;
  return (t[u] * (1 - h) + t[u + 1] * h) * (1 - d) + (t[u + n] * (1 - h) + t[u + n + 1] * h) * d;
}
function Re(t, n, o, s, a, e, r, i = bs, l = M0(e, r)) {
  const h = Tr(s), d = Ir(e, r), u = Pr(n, o, h, d, i, l), c = Zo.get(u);
  if (c) return c;
  if (a) return M1(t, n, o, s, e, r, i, l);
  const f = `${n}|${Math.round(o)}|`;
  if (h > 192 && !l0 && !Ls.has(u)) {
    let b = !1;
    for (const M of Zo.keys()) M.startsWith(f) && (b = !0);
    for (const M of Ls) M.startsWith(f) && (b = !0);
    b || Re(t, n, o, 1, !1, e, r, i, l);
  }
  if (!Ls.has(u)) {
    Ls.add(u), xe.delete(u);
    const b = `${n}|${Math.round(o)}|${h}|${d}`, M = xa.get(b) ?? [];
    for (M.push(u); M.length > 2; ) {
      const m = M.shift();
      xe.add(m), Ls.delete(m);
    }
    xa.set(b, M);
    const y = Or(t, u, h, e, r, i, l);
    if (y) for (const m of y.steps) _e(() => xe.has(u) ? void 0 : m());
  }
  j0 = !0;
  for (const [b, M] of Zo) if (b.startsWith(f)) return M;
  return null;
}
function u1(t) {
  let n = t >>> 0;
  return () => {
    n = n + 1831565813 | 0;
    let o = Math.imul(n ^ n >>> 15, 1 | n);
    return o = o + Math.imul(o ^ o >>> 7, 61 | o) ^ o, ((o ^ o >>> 14) >>> 0) / 4294967296;
  };
}
function zs(t, n) {
  return (o, s) => {
    const a = o / t, e = s / t, r = Math.floor(a), i = Math.floor(e), l = a - r, h = e - i, d = l * l * (3 - 2 * l), u = h * h * (3 - 2 * h), c = (m, A) => Y0(m + n * 131, A - n * 71), f = c(r, i), b = c(r + 1, i), M = c(r, i + 1), y = c(r + 1, i + 1);
    return (f + (b - f) * d) * (1 - u) + (M + (y - M) * d) * u;
  };
}
function d1(t, n, o) {
  let s = t * 374761393 + n * 668265263 + o * 1274126177 | 0;
  return s = Math.imul(s ^ s >>> 13, 1274126177), ((s ^ s >>> 16) >>> 0) / 4294967296;
}
function p1(t, n) {
  return (o, s, a) => {
    const e = o / t, r = s / t, i = a / t, l = Math.floor(e), h = Math.floor(r), d = Math.floor(i), u = e - l, c = r - h, f = i - d, b = u * u * (3 - 2 * u), M = c * c * (3 - 2 * c), y = f * f * (3 - 2 * f), m = (k, L, S) => d1(k + n * 131, L - n * 71, S + n * 17), A = (k, L, S) => k + (L - k) * S, g = A(m(l, h, d), m(l + 1, h, d), b), I = A(m(l, h + 1, d), m(l + 1, h + 1, d), b), x = A(m(l, h, d + 1), m(l + 1, h, d + 1), b), p = A(m(l, h + 1, d + 1), m(l + 1, h + 1, d + 1), b);
    return A(A(g, I, M), A(x, p, M), y);
  };
}
function M1(t, n = "custom", o = 9.75, s = 320, a = -1, e = 0, r = bs, i = M0(a, e)) {
  const l = Tr(s), h = Pr(n, o, l, Ir(a, e), r, i), d = Zo.get(h);
  if (d) return d;
  const u = Or(t, h, l, a, e, r, i);
  if (u) for (const c of u.steps) c();
  return Zo.get(h) ?? { R: 0, mask: null, haze: null, cut: null, core: null, dark: null, light: null, glint: null, back: null, backSoft: null };
}
function Or(t, n, o, s, a, e = bs, r = M0(s, a)) {
  if (Zo.has(n)) return null;
  const i = (w) => {
    Zo.size >= 24 && Zo.delete(Zo.keys().next().value), Zo.set(n, w), Ls.delete(n), gr();
  }, { N: l } = t, h = o / Tt, d = (w, H, K) => ys(w, l, (H + ot) / Tt * l - 0.5, (K + ot) / Tt * l - 0.5), u = (w, H) => d(t.sd, w, H), c = ot + vo, f = Math.round(o * Vn / Tt), b = { R: o, mask: null, haze: null, cut: null, core: null, dark: null, light: null, glint: null, back: null, backSoft: null }, M = En(f), y = En(f), m = En(o), A = En(f), g = En(f), I = En(f), x = M && kn(M, !1), p = y && kn(y, !1), k = m && kn(m, !1), L = A && kn(A, !1), S = g && kn(g, !1), O = I && kn(I, !1);
  if (!M || !y || !m || !A || !g || !I || !x || !p || !k || !L || !S || !O)
    return i(b), null;
  const F = u1(l * 7919 + 17), W = zs(3.4, 21), C = zs(22, 9), $ = zs(13, 57), { length: T, density: E, fuzz: z, clumps: B, curl: R } = e, Y = e.gravity ?? bs.gravity, et = Math.hypot(s, a) || 1, ht = s / et, Et = a / et, Pt = [ht, Et, 0], Ot = [0, 0, 1], Gt = [0, 1, 0], P = $r(Pt, Ot, r.front), q = Er([r.bx, r.by, 0], Ot), V = ss([P[0], P[1], P[2] + 1]), bt = ss([-0.55 * Pt[0] + 0.85 * Ot[0] + 0.15 * Gt[0], -0.55 * Pt[1] + 0.85 * Ot[1] + 0.15 * Gt[1], -0.55 * Pt[2] + 0.85 * Ot[2] + 0.15 * Gt[2]]);
  let G = 12;
  for (let w = -ot; w < 60; w += 0.5) if (u(50, w) > 0.5) {
    G = w + 1;
    break;
  }
  G -= 18;
  const N = 50, dt = (w, H) => {
    const v = u(w - 0.8, H) - u(w + 0.8, H), j = u(w, H - 0.8) - u(w, H + 0.8), Z = Math.hypot(v, j) || 1;
    return [v / Z, j / Z];
  }, at = (w, H) => {
    let K = w - N, v = H - G;
    const j = Math.hypot(K, v) || 1;
    K /= j, v /= j;
    const Z = Y * (1 - 0.6 * Math.exp(-j / 8));
    let st = K * (1 - 0.8 * Z), J = v * (1 - 0.8 * Z) + Z;
    const xt = u(w, H);
    if (xt < 5) {
      const [qt, vt] = dt(w, H), It = Math.max(0, -vt), mt = qt * (1 - Y * It), yt = vt * (1 - Y * It) + 1.2 * Y, Ct = Math.max(0, Math.min(1, 1 - xt / 5)) * 0.75;
      st = st * (1 - Ct) + mt * Ct * 1.6, J = J * (1 - Ct) + yt * Ct * 1.6;
    }
    const Mt = (W(w, H) - 0.5) * (0.5 + 1.6 * R) + ($(w, H) - 0.5) * (0.6 + R), ut = Math.cos(Mt), it = Math.sin(Mt), Q = st * ut - J * it, rt = st * it + J * ut, gt = Math.hypot(Q, rt) || 1;
    return [Q / gt, rt / gt];
  }, At = [], D = (w, H, K) => {
    for (let v = 0; v < w; v += H) At.push(() => K(v, Math.min(w, v + H)));
  }, ft = (w, H) => d(t.h, w, H), Yt = (w, H) => {
    const v = (ft(w + 0.6, H) - ft(w - 0.6, H)) / 1.2, j = (ft(w, H + 0.6) - ft(w, H - 0.6)) / (2 * 0.6), Z = Math.hypot(v, j);
    return [Z > 1e-6 ? -v / Z : 0, Z > 1e-6 ? -j / Z : 0, Z / Math.sqrt(1 + Z * Z)];
  }, _ = 112, wt = Vn / _, pn = new Float32Array(_ * _), gn = new Float32Array(_ * _), fn = new Float32Array(_ * _), Sn = new Float32Array(_ * _), rn = new Float32Array(_ * _), Mn = new Float32Array(_ * _), jt = new Float32Array(_ * _), Qt = new Float32Array(_ * _), Dt = new Float32Array(_ * _), Jt = new Float32Array(_ * _), Wn = new Float32Array(_ * _), Un = new Float32Array(_ * _), no = new Float32Array(_ * _);
  D(_, 28, (w, H) => {
    for (let K = w, v = w * _; K < H; K++)
      for (let j = 0; j < _; j++, v++) {
        const Z = (j + 0.5) * wt - c, st = (K + 0.5) * wt - c;
        let [J, xt] = at(Z, st);
        const [Mt, ut, it] = Yt(Z, st), Q = it * (0.25 + 0.5 * (1 - Y)) * (1 - Y * Math.max(0, -ut));
        J = J * (1 - Q) + Mt * Q, xt = xt * (1 - Q) + (ut + 0.35 * Y) * Q;
        const rt = Math.hypot(J, xt) || 1;
        J /= rt, xt /= rt, pn[v] = J, gn[v] = xt, fn[v] = it;
        let gt = Mt * it, qt = ut * it, vt = Math.sqrt(Math.max(0, 1 - it * it));
        const It = u(Z, st);
        if (It < 2) {
          const [Xt, Kt] = dt(Z, st), Bt = It >= 0 ? 0.7 * (1 - It / 2) : Math.min(1, 0.7 - 0.2 * It);
          gt += Bt * (Xt - gt), qt += Bt * (Kt - qt), vt -= Bt * vt;
          const Cn = Math.hypot(gt, qt, vt) || 1;
          gt /= Cn, qt /= Cn, vt /= Cn;
        }
        Sn[v] = gt, rn[v] = qt, Mn[v] = vt, jt[v] = mn(-3.5, -1.5, It), no[v] = C(Z, st), Wn[v] = It > 0 ? ft(Z, st) : 0;
        const mt = Math.sqrt(gt * gt + qt * qt), yt = mt > 1e-4 ? gt / mt : 0, Ct = mt > 1e-4 ? qt / mt : 0, St = J * yt + xt * Ct, Lt = (1 - Math.max(0, vt)) * St;
        let Rt = P0 * (J - Lt * yt) + Pa * mt * yt, $t = P0 * (xt - Lt * Ct) + Pa * mt * Ct;
        const Ht = mn(-0.5, 1.5, It);
        Rt = J + (Rt - J) * Ht, $t = xt + ($t - xt) * Ht;
        const Ut = Math.sqrt(Rt * Rt + $t * $t) || 1;
        Qt[v] = Rt / Ut, Dt[v] = $t / Ut, Jt[v] = 1 + (Math.min(1, Ut) - 1) * Ht;
      }
  }), At.push(() => {
    const w = new Float32Array(_ * _), H = Float32Array.from(Wn);
    for (let K = 0; K < 3; K++) {
      for (let v = 0, j = 0; v < _; v++) for (let Z = 0; Z < _; Z++, j++) {
        let st = 0;
        for (let J = -2; J <= 2; J++) st += H[v * _ + Math.min(_ - 1, Math.max(0, Z + J))];
        w[j] = st / 5;
      }
      for (let v = 0, j = 0; v < _; v++) for (let Z = 0; Z < _; Z++, j++) {
        let st = 0;
        for (let J = -2; J <= 2; J++) st += w[Math.min(_ - 1, Math.max(0, v + J)) * _ + Z];
        H[j] = st / 5;
      }
    }
    for (let K = 0, v = 0; K < _; K++) for (let j = 0; j < _; j++, v++) {
      const Z = mn(0.2, 2, u((j + 0.5) * wt - c, (K + 0.5) * wt - c)), st = mn(0.3, 3.5, H[v] - Wn[v]) * Z, J = mn(0.15, 0.85, rn[v]) * (1 - Mn[v]);
      Un[v] = Math.min(1, st + 0.45 * J) * jt[v];
    }
  });
  const bn = (w, H, K) => ys(w, _, (H + c) / wt - 0.5, (K + c) / wt - 0.5), Mo = (w, H) => {
    const K = bn(Qt, w, H), v = bn(Dt, w, H), j = Math.sqrt(K * K + v * v);
    return j > 1e-4 ? [K / j, v / j] : [0, 1];
  }, Qn = (w, H) => {
    const K = bn(pn, w, H), v = bn(gn, w, H), j = Math.sqrt(K * K + v * v);
    return j > 1e-4 ? [K / j, v / j] : [0, 1];
  }, qn = f >> 1, mo = qn / Vn, Dn = new Float32Array(qn * qn), zo = new Float32Array(qn * qn), en = (w, H, K) => ys(w, qn, (H + c) * mo - 0.5, (K + c) * mo - 0.5), sn = zs(0.7 + 0.35 * T, 61), vn = zs(2.2 + 0.6 * T, 67), An = (0.2 + 0.5 * z) * Math.min(1.8, T), xo = (w, H) => {
    const K = 0.3 * Math.max(-1.6, Math.min(1.6, en(Dn, w, H))) / 1.6 + 0.25 * (sn(w, H) - 0.5) * 2.4 + 0.45 * (vn(w, H) - 0.5) * 2.4;
    return An * Math.max(-1, Math.min(1, K));
  }, X = (0.8 + 0.45 * T) * (0.65 + 0.4 * B), nt = 1.5 + 1.6 * T, ct = 0.32 * X * (0.15 + 0.85 * B), U = new Float32Array(f * f).fill(-0.25 * ct), tt = new Int32Array(f * f).fill(-1), pt = 16, nn = Math.sqrt(0.6 * X * nt / Xc / ke), Wt = Math.ceil(Vn / nn), lt = new Float32Array(Wt * Wt * pt);
  let yn = 0;
  const tn = 0.45 - 0.2 * Y, an = p1(1.6 * nt, 79), In = zs(9, 73), cn = 1.5 * ct * (0.25 + B);
  At.push(() => {
    for (let w = 0; w < Wt; w++) for (let H = 0; H < Wt; H++) {
      const K = (H + F()) * nn - c, v = (w + F()) * nn - c, j = F(), Z = F(), st = F(), J = F(), xt = F(), Mt = F(), ut = F();
      let it = bn(Sn, K, v), Q = bn(rn, K, v), rt = bn(Mn, K, v);
      const gt = Math.hypot(it, Q, rt) || 1;
      it /= gt, Q /= gt, rt /= gt;
      const [qt, vt] = Qn(K, v), It = (j - 0.5) * (0.2 + 0.45 * R), mt = Math.cos(It), yt = Math.sin(It), Ct = qt * mt - vt * yt, St = qt * yt + vt * mt, Lt = Ct * it + St * Q;
      let Rt = Ct - Lt * it, $t = St - Lt * Q, Ht = -Lt * rt, Ut = Math.hypot(Rt, $t, Ht);
      Ut < 0.05 && (Rt = rt * it, $t = rt * Q, Ht = rt * rt - 1, Ut = Math.hypot(Rt, $t, Ht) || 1), Rt /= Ut, $t /= Ut, Ht /= Ut;
      let Xt = Q * Ht - rt * $t, Kt = rt * Rt - it * Ht, Bt = it * $t - Q * Rt;
      const Cn = tn + 0.2 * Z, Kn = Math.cos(Cn), Rn = Math.sin(Cn), go = 0.8 + 0.45 * In(K, v), bo = X * go * (0.8 + 0.4 * st), eo = nt * go * (0.75 + 0.5 * J);
      let Hn = (Rt * Kn + it * Rn) * eo * h, wn = ($t * Kn + Q * Rn) * eo * h, xn = Math.hypot(Hn, wn);
      xn < 1.5 ? (Hn = Ct, wn = St, xn = 1.5) : (Hn /= xn, wn /= xn);
      let Yn = -Xt * wn + Kt * Hn;
      Yn < 0 && (Xt = -Xt, Kt = -Kt, Bt = -Bt, Yn = -Yn);
      const Jn = Math.max(0.6, 0.5 * bo * h * Math.max(0.15, Yn)), Ao = xn / (eo * h) * (Jn / (0.5 * bo * h)), Ln = an(K, v, ft(K, v));
      if (xt > ke / Math.max(ke, Ao) * (1 - Kc * B * (1 - mn(0.25, 0.65, Ln)))) continue;
      const hn = yn++ * pt;
      lt[hn] = (K + c) * h, lt[hn + 1] = (v + c) * h, lt[hn + 2] = Hn, lt[hn + 3] = wn, lt[hn + 4] = xn, lt[hn + 5] = Jn, lt[hn + 6] = 0.1 * ct * Mt + cn * Ln, lt[hn + 7] = (ut - 0.5) * 1.2 * R, lt[hn + 8] = Rt, lt[hn + 9] = $t, lt[hn + 10] = Ht, lt[hn + 11] = Xt, lt[hn + 12] = Kt, lt[hn + 13] = Bt, lt[hn + 14] = eo, lt[hn + 15] = bo;
    }
  });
  const Tn = (w) => (w < 0.25 ? 4 * w : 1) * (1 - 0.5 * w), ho = 6;
  for (let w = 0; w < ho; w++) At.push(() => {
    const H = Math.floor(yn * w / ho), K = Math.floor(yn * (w + 1) / ho);
    for (let v = H; v < K; v++) {
      const j = v * pt, Z = lt[j], st = lt[j + 1], J = lt[j + 2], xt = lt[j + 3], Mt = lt[j + 4], ut = lt[j + 5], it = lt[j + 6], Q = lt[j + 7], rt = ut * (1 + Math.abs(Q)) + 1, gt = Z + J * Mt, qt = st + xt * Mt, vt = Math.max(0, Math.floor(Math.min(Z, gt) - rt)), It = Math.min(f - 1, Math.ceil(Math.max(Z, gt) + rt)), mt = Math.max(0, Math.floor(Math.min(st, qt) - rt)), yt = Math.min(f - 1, Math.ceil(Math.max(st, qt) + rt)), Ct = 1 / Mt, St = 1 / ut;
      for (let Lt = mt; Lt <= yt; Lt++) {
        const Rt = Lt + 0.5 - st;
        for (let $t = vt, Ht = Lt * f + vt; $t <= It; $t++, Ht++) {
          const Ut = $t + 0.5 - Z, Xt = (Ut * J + Rt * xt) * Ct;
          if (Xt <= 0 || Xt >= 1) continue;
          const Kt = Se * Math.sqrt(Xt) * (1 - Xt), Bt = (Rt * J - Ut * xt) * St - Q * Xt * Xt;
          if (Bt >= Kt || Bt <= -Kt) continue;
          const Cn = Bt / Kt, Kn = it + ct * Tn(Xt) * (1 - Cn * Cn);
          Kn > U[Ht] && (U[Ht] = Kn, tt[Ht] = v);
        }
      }
    }
  });
  const _n = new Float32Array(f * f), Zt = Math.max(1, Math.round(0.3 * X * h)), ln = new Float32Array(f), Vt = (w, H, K, v, j) => {
    const Z = j === 1 ? f : 1, st = 1 / (2 * K + 1), J = (ut) => ln[ut < 0 ? 0 : ut >= f ? f - 1 : ut], xt = v * Z;
    for (let ut = 0; ut < f; ut++) ln[ut] = w[xt + ut * j];
    let Mt = 0;
    for (let ut = -K; ut <= K; ut++) Mt += J(ut);
    for (let ut = 0; ut < f; ut++)
      H[xt + ut * j] = Mt * st, Mt += J(ut + K + 1) - J(ut - K);
  };
  At.push(() => {
    for (let w = 0; w < f; w++) Vt(U, _n, Zt, w, 1);
    for (let w = 0; w < f; w++) Vt(_n, _n, Zt, w, 1);
  }), At.push(() => {
    for (let w = 0; w < f; w++) Vt(_n, _n, Zt, w, f);
    for (let w = 0; w < f; w++) Vt(_n, _n, Zt, w, f);
  }), At.push(() => {
    for (let w = 0; w < f; w++) Vt(U, U, 1, w, 1);
    for (let w = 0; w < f; w++) Vt(U, U, 1, w, f);
  });
  const Pn = new ImageData(f, f), as = new ImageData(f, f), Vs = new ImageData(f, f), qs = new ImageData(f, f), vs = new ImageData(f, f), Ds = new Float32Array(f * f), Ft = new Float32Array(11), Cs = (w, H, K, v, j) => {
    const Z = Math.min(_ - 1, Math.max(0, (w + c) / wt - 0.5)), st = Math.min(_ - 1, Math.max(0, (H + c) / wt - 0.5)), J = Math.min(_ - 2, Z | 0), xt = Math.min(_ - 2, st | 0), Mt = Z - J, ut = st - xt, it = xt * _ + J, Q = (1 - Mt) * (1 - ut), rt = Mt * (1 - ut), gt = (1 - Mt) * ut, qt = Mt * ut, vt = (hn) => hn[it] * Q + hn[it + 1] * rt + hn[it + _] * gt + hn[it + _ + 1] * qt;
    let It = vt(Sn), mt = vt(rn), yt = vt(Mn);
    const Ct = Math.sqrt(It * It + mt * mt + yt * yt) || 1;
    It /= Ct, mt /= Ct, yt /= Ct;
    const St = It * P[0] + mt * P[1] + yt * P[2];
    Ft[4] = It, Ft[5] = mt, Ft[6] = yt, Ft[7] = St, Ft[8] = vt(Un);
    const Lt = vt(jt);
    if (Ft[9] = Lt, Ft[10] = vt(no), Lt <= 0) {
      Ft[0] = Ft[1] = Ft[3] = 0, Ft[2] = 0.7;
      return;
    }
    const Rt = mn(-0.2, 0.5, St), $t = K * It + v * mt;
    let Ht = K - $t * It, Ut = v - $t * mt, Xt = -$t * yt;
    const Kt = Math.sqrt(Ht * Ht + Ut * Ut + Xt * Xt);
    Kt > 1e-3 ? (Ht /= Kt, Ut /= Kt, Xt /= Kt) : (Ht = 0, Ut = 0, Xt = 1);
    const Bt = Math.cos(j), Cn = Math.sin(j);
    Ht = Ht * Bt + It * Cn, Ut = Ut * Bt + mt * Cn, Xt = Xt * Bt + yt * Cn;
    const Kn = Ht * V[0] + Ut * V[1] + Xt * V[2], Rn = It * V[0] + mt * V[1] + yt * V[2], go = Kn - 0.12 * Rn, bo = Kn + 0.2 * Rn, eo = Math.max(0, 1 - go * go), Hn = eo * eo, wn = Hn * Hn, xn = wn * wn, Yn = xn * xn, Jn = Math.max(0, 1 - bo * bo), Ao = Jn * Jn;
    Ft[0] = Rt * (0.85 * Yn * Yn * wn + 0.15 * Ao * Ao), Ft[0] *= (0.4 + 0.6 * (1 - mn(0.35, 0.85, St))) * Lt;
    const Ln = Math.sqrt(Math.max(0, 1 - Xt * Xt));
    Ft[1] = mn(-0.3, 0.6, It * q[0] + mt * q[1] + yt * q[2]) * Math.pow(1 - yt, 1.6) * (0.4 + 0.6 * Ln) * (1 - 0.6 * Math.max(0, mt)) * Lt, Ft[3] = mn(-0.5, 0.75, It * q[0] + mt * q[1] + yt * q[2]) * Math.pow(1 - yt, 0.85) * (1 - 0.6 * Math.max(0, mt)) * Lt, Ft[2] = Rt * Lt + 0.7 * (1 - Lt);
  };
  At.push(() => {
    for (let w = 0, H = 0; w < f; w++) for (let K = 0; K < f; K++, H++) {
      const v = Y0(K + 911, w + 37);
      Ds[H] = v * v * v;
    }
  });
  const Qo = 0.25, ko = Math.sqrt(1 / 7 - 1 / 16), ws = Math.max(1, Math.round((0.35 + 0.4 * T) * h)), Ns = [], rs = new Float32Array(2 * ws + 1), xs = new Float32Array(2 * ws + 1);
  for (let w = 0; w <= 2 * ws; w++) {
    const H = new Float32Array(w + 1);
    let K = 0, v = 0;
    for (let j = 0; j <= w; j++) {
      const Z = w ? j / w : 0, st = Z <= F0 ? 1 : (1 - Z) / (1 - F0);
      H[j] = 1 - t1 * Z, K += H[j] * st * Qo, v += H[j] * H[j] * (st / 7 - Qo * Qo * st * st);
    }
    Ns.push(H), rs[w] = K, xs[w] = Math.sqrt(Math.max(1e-6, v));
  }
  const oe = 0.12 * (o >= 512 ? 1 : o >= 320 ? 0.75 : 0.4) * Math.min(1.4, 0.55 + 0.35 * E), y0 = Math.max(1, 1.5 * X * h), kt = Math.max(1, Math.min(5, Math.round(y0))), _t = new Int32Array(kt), Nt = new Int32Array(kt), Fn = new Float32Array(kt);
  for (let w = 0; w < kt; w++) {
    const H = (w + 1) / kt * y0;
    _t[w] = Math.round(ht * H), Nt[w] = Math.round(Et * H), Fn[w] = Math.hypot(_t[w], Nt[w]) / h;
  }
  const so = Z0(1.35), yo = Z0(1 / 2.2), fo = (w) => {
    const H = (w + Ia) / (1 + Ia);
    return H <= 0 ? 0 : H >= 1 ? 1 : so[H * Ks | 0];
  }, So = o >= 512 ? 1 : o >= 320 ? 0.8 : 0.55, zn = new Float32Array(4), Ro = (w, H, K, v, j) => {
    if (j < 0) {
      const [Lt, Rt] = Mo(K, v);
      zn[0] = Lt, zn[1] = Rt, zn[2] = 0.5, zn[3] = 0;
      return;
    }
    const Z = j * pt, st = lt[Z + 2], J = lt[Z + 3], xt = lt[Z + 4], Mt = lt[Z + 5], ut = lt[Z + 7], it = w + 0.5 - lt[Z], Q = H + 0.5 - lt[Z + 1], rt = Math.min(0.995, Math.max(5e-3, (it * st + Q * J) / xt)), gt = Math.sqrt(rt), qt = Se * gt * (1 - rt), vt = Se * (0.5 * (1 - rt) / gt - gt), It = Math.max(-1, Math.min(1, ((Q * st - it * J) / Mt - ut * rt * rt) / qt)), mt = Math.max(-1.2, Math.min(1.2, It * vt + 2 * ut * rt)), yt = xt * st - mt * Mt * J, Ct = xt * J + mt * Mt * st, St = Math.sqrt(yt * yt + Ct * Ct) || 1;
    zn[0] = yt / St, zn[1] = Ct / St, zn[2] = rt, zn[3] = Tn(rt) * (1 - It * It);
  }, Io = new Float32Array(f * f);
  D(f, 32, (w, H) => {
    for (let K = w; K < H; K++) {
      const v = (K + 0.5) / h - c;
      for (let j = 0, Z = K * f; j < f; j++, Z++) {
        const st = (j + 0.5) / h - c;
        Ro(j, K, st, v, tt[Z]);
        const J = zn[0], xt = zn[1], Mt = Math.min(_ - 1, Math.max(0, (st + c) / wt - 0.5)), ut = Math.min(_ - 1, Math.max(0, (v + c) / wt - 0.5)), it = Math.min(_ - 2, Mt | 0), Q = Math.min(_ - 2, ut | 0), rt = Mt - it, gt = ut - Q, qt = Q * _ + it, vt = (fn[qt] * (1 - rt) + fn[qt + 1] * rt) * (1 - gt) + (fn[qt + _] * (1 - rt) + fn[qt + _ + 1] * rt) * gt, It = (Jt[qt] * (1 - rt) + Jt[qt + 1] * rt) * (1 - gt) + (Jt[qt + _] * (1 - rt) + Jt[qt + _ + 1] * rt) * gt, mt = 2 * Math.max(1, Math.min(ws, Math.round(ws * (0.5 + 0.5 * vt) * It / P0))), yt = Ns[mt];
        let Ct = 0, St = 0;
        for (let $t = 0; $t <= mt; $t++) {
          const Ht = Math.round(j - J * $t), Ut = Math.round(K - xt * $t);
          if (Ht < 0 || Ut < 0 || Ht >= f || Ut >= f) {
            Ct += rs[mt] / (mt + 1);
            continue;
          }
          const Xt = Ds[Ut * f + Ht], Kt = Xt * 53.7, Bt = mt * (F0 + (1 - F0) * (Kt - Math.floor(Kt)));
          $t <= Bt && (Ct += Xt * yt[$t], St += Xt * yt[$t] * $t / (Bt || 1));
        }
        const Lt = (Ct - rs[mt]) / xs[mt], Rt = Ct > 1e-4 ? St / Ct : 0.5;
        Io[Z] = Lt + n1 * Math.min(2.5, Math.max(0, Lt)) * (Rt - 0.45);
      }
    }
  });
  let _s = 0, Us = 0;
  D(f, 16, (w, H) => {
    const K = Pn.data, v = as.data, j = Vs.data, Z = qs.data, st = vs.data;
    for (let J = w; J < H; J++) {
      const xt = (J + 0.5) / h - c;
      for (let Mt = 0; Mt < f; Mt++) {
        const ut = (Mt + 0.5) / h - c, it = J * f + Mt, Q = tt[it], rt = Q * pt;
        Ro(Mt, J, ut, xt, Q);
        const gt = zn[0], qt = zn[1], vt = zn[2], It = zn[3];
        Cs(ut, xt, gt, qt, 0.25 + 0.2 * It);
        const mt = Ft[4], yt = Ft[5], Ct = Ft[6], St = Ft[7], Lt = Mt > 0 ? it - 1 : it, Rt = Mt < f - 1 ? it + 1 : it, $t = J > 0 ? it - f : it, Ht = J < f - 1 ? it + f : it, Ut = (U[Rt] - U[Lt]) * h / (Rt - Lt || 1), Xt = (U[Ht] - U[$t]) * h * f / (Ht - $t || 1), Kt = Math.sqrt(mt * mt + yt * yt);
        let Bt = 1, Cn = 0, Kn = 0, Rn = 1, go = 0;
        Kt > 1e-3 && (Bt = -yt / Kt, Cn = mt / Kt, Kn = -Ct * mt / Kt, Rn = -Ct * yt / Kt, go = Kt);
        const bo = Math.max(-1.5, Math.min(1.5, Ut * Bt + Xt * Cn)), eo = Math.max(-1.5, Math.min(1.5, Ut * Kn + Xt * Rn));
        let Hn = mt - bo * Bt - eo * Kn, wn = yt - bo * Cn - eo * Rn, xn = Ct - eo * go;
        const Yn = Math.sqrt(Hn * Hn + wn * wn + xn * xn) || 1;
        Hn /= Yn, wn /= Yn, xn /= Yn;
        let Jn = 1;
        if (Q >= 0) {
          const ro = lt[rt + 8], Ko = lt[rt + 9], Fo = lt[rt + 10], Lo = 0.9 * ro + 0.44 * mt, Go = 0.9 * Ko + 0.44 * yt, Bo = 0.9 * Fo + 0.44 * Ct, us = (Lo * P[0] + Go * P[1] + Bo * P[2]) / (Math.sqrt(Lo * Lo + Go * Go + Bo * Bo) || 1);
          Jn = 1 - Ta + Ta * Math.min(1.2, Math.sqrt(Math.max(0, 1 - us * us)) / 0.85);
        }
        const Ao = Hn * P[0] + wn * P[1] + xn * P[2], Ln = U[it];
        let hn = 1;
        if (St > -0.25) {
          const ro = Math.min(0.97, Math.max(0.05, St)), Ko = ro / Math.sqrt(1 - ro * ro);
          let Fo = 0;
          for (let Lo = 0; Lo < kt; Lo++) {
            const Go = Mt + _t[Lo], Bo = J + Nt[Lo];
            if (Go < 0 || Bo < 0 || Go >= f || Bo >= f) break;
            const us = U[Bo * f + Go] - Ln - Fn[Lo] * Ko;
            us > Fo && (Fo = us);
          }
          hn = 1 - Gc * mn(0, 0.35 * ct, Fo);
        }
        let hs = 1 - Bc * mn(0, 0.6 * ct, _n[it] - Ln);
        Q >= 0 && (hs *= 1 - jc * (1 - mn(0, 0.35, vt)));
        const Oo = ka + Sa * Math.max(0, Hn * bt[0] + wn * bt[1] + xn * bt[2]), Po = ka + Sa * Math.max(0, mt * bt[0] + yt * bt[1] + Ct * bt[2]);
        let $n = hs * (Oo + fo(Ao) * hn * Jn) * Zc / (Po + fo(St));
        Q >= 0 && ($n *= (1 + 0.15 * vt * vt) * (1 + 0.08 * (Y0(Q, 5) - 0.5)));
        const Ho = Ft[8];
        $n *= 1 - Uc * Ho * (0.6 + 0.4 * mn(0, 0.6 * ct, _n[it] - Ln)), $n = 1 + ($n - 1) * So;
        const Co = Ft[9], Wo = (Po + fo(St)) / Jc, Yo = (Wo >= 1 ? 1 : yo[Wo * Ks | 0]) * Co + 0.75 * (1 - Co);
        let qo = Math.sqrt($n > 2.4 ? 2.4 : $n);
        qo > 1 && (qo = 1 + (qo - 1) / (1 + 2.5 * Yo * (qo - 1)));
        const Is = Io[it];
        let C0 = 0;
        if (St > 0) {
          const ro = P[0] - St * mt, Ko = P[1] - St * yt, Fo = Math.sqrt(1 - St * St), Lo = Fo > 1e-3 ? o1 * h * Math.min(3, Fo / Math.max(0.2, St)) / Fo : 0, Go = Math.min(f - 1.001, Math.max(0, Mt + ro * Lo)), Bo = Math.min(f - 1.001, Math.max(0, J + Ko * Lo)), us = Go | 0, Ue = Bo | 0, w0 = Go - us, Qe = Bo - Ue, x0 = Ue * f + us, tc = (Io[x0] * (1 - w0) + Io[x0 + 1] * w0) * (1 - Qe) + (Io[x0 + f] * (1 - w0) + Io[x0 + f + 1] * w0) * Qe;
          C0 = Math.max(0, tc - Math.max(0, Is)) * mn(0, 0.3, St);
        }
        let Ts = qo * (1 + oe * (Is * (0.45 + 0.55 * Ft[2]) * (0.75 + 0.5 * vt) - s1 * C0)) + 0.04 * (Ft[10] - 0.5) + Nc * So * Co;
        const Nn = Math.min(ut + c, Vn - c - ut, xt + c, Vn - c - xt), he = Nn >= 8 ? 1 : Nn <= 0 ? 0 : Nn / 8 * (Nn / 8) * (3 - 2 * Nn / 8);
        Ts = 1 + (Ts - 1) * he;
        const Gn = it * 4;
        Ts < 1 ? K[Gn + 3] = Math.round(255 * Math.min(1, (1 - Ts) * Yo / Math.max(0.4, Yo - Lr))) : (v[Gn] = v[Gn + 1] = v[Gn + 2] = 255, v[Gn + 3] = Math.round(255 * Math.min(1, Vc * (Fa - 1) * Yo / (Fa - Yo) * (Ts - 1) * (1 - 0.7 * Ho))));
        const Xo = Math.max(-2, Math.min(2, 4 * (qo - 1))), on = Mt >> 1, dn = J >> 1;
        if (on < qn && dn < qn) {
          const ro = dn * qn + on;
          Dn[ro] += 0.25 * Ln, zo[ro] += 0.25 * Xo;
        }
        const ao = mn(-0.4, 1, Xo) * Math.max(0, Math.min(1.4, 0.65 + 0.25 * Is));
        j[Gn] = j[Gn + 1] = j[Gn + 2] = Z[Gn] = Z[Gn + 1] = Z[Gn + 2] = 255, j[Gn + 3] = Math.round(255 * Math.min(1, Ft[0] * ao)), Z[Gn + 3] = Math.round(255 * Math.min(1, Ft[1] * Math.max(0, Math.min(1.6, 0.5 + 0.4 * Is))));
        const fs = Math.max(0.55, Math.min(1.3, 0.85 + 0.15 * Is + 0.12 * Xo));
        st[Gn] = st[Gn + 1] = st[Gn + 2] = 255, st[Gn + 3] = Math.round(255 * Math.min(1, 0.85 * Ft[3] * fs));
      }
    }
  }), At.push(() => {
    const w = qn * qn;
    for (let v = 0; v < w; v++)
      _s += Dn[v], Us += Dn[v] * Dn[v];
    const H = _s / w, K = Math.sqrt(Math.max(1e-9, Us / w - H * H));
    for (let v = 0; v < w; v++) Dn[v] = Math.max(-2.5, Math.min(2.5, (Dn[v] - H) / K));
  }), At.push(() => {
    x.putImageData(Pn, 0, 0), p.putImageData(as, 0, 0), L.putImageData(Vs, 0, 0), O.putImageData(vs, 0, 0), S.putImageData(qs, 0, 0);
    for (const w of [x, p, L, S])
      w.setTransform(1, 0, 0, 1, vo * h, vo * h), w.lineCap = "round", w.lineJoin = "round";
  });
  const cs = 16, is = Vn * Vn, ks = o >= 512 ? 1 : o >= 320 ? 0.45 : 0, Zr = [
    { count: 0.12, len: 1.2, vary: 1, endOn: 0.6, width: 0.09, spread: 30, alpha: 0.4, deep: 1, lift: 0.25, light: 0.46, dark: 0.34, bend: 0.93, clump: [1, 0], clumpW: 0, shadow: 0, shadowW: 1, over: 0, crowd: !1, short: 0 },
    { count: 0.4 * ks, len: 0.9, vary: 1.2, endOn: 0.35, width: 0.13, spread: 100, alpha: 0.26, deep: 0.2, lift: 0.18, light: 0.55, dark: 0.06, bend: 1.2, clump: [1, Math.round(1 + 2 * B)], clumpW: 0.08 + 0.07 * B, shadow: 0.25, shadowW: 2, over: 0.25, crowd: !0, short: 1 }
  ], Vr = (w) => Math.min(cs - 1, Math.max(0, Math.round((Math.max(-1, Math.min(1, w)) + 1) / 2 * (cs - 1)))), To = 6, g0 = (w) => Math.min(To - 1, w * To | 0), se = 4, $o = new Float32Array(se + 1), Eo = new Float32Array(se + 1);
  for (const w of Zr) {
    if (w.count <= 0) continue;
    const H = w.clump[0] + 0.5 * w.clump[1], K = Math.max(1, Math.ceil(is * w.count * E * (w.crowd ? 2 : 1) * (0.5 + 0.5 * H) / 9e3));
    for (let v = 0; v < K; v++) At.push(() => {
      const j = [], Z = [], st = [], J = [];
      for (let Q = 0; Q < cs; Q++) j.push(new Path2D());
      for (let Q = 0; Q < To; Q++) Z.push(new Path2D()), st.push(new Path2D());
      for (let Q = 0; Q < 3; Q++) J.push(new Path2D());
      const xt = new Path2D(), Mt = Math.round(is * w.count * E * (w.crowd ? 2 : 1) / K);
      for (let Q = 0; Q < Mt; Q++) {
        const rt = F() * Vn - c, gt = F() * Vn - c, qt = F(), vt = F(), It = F(), mt = F(), yt = F(), Ct = F();
        if (Ct * 8 > Math.min(rt + c, Vn - c - rt, gt + c, Vn - c - gt) || w.crowd && Ct > (u(rt, gt) > 0 ? 0.5 / Math.max(0.25, bn(Mn, rt, gt)) : 0.5)) continue;
        const [St, Lt] = Mo(rt, gt), Rt = bn(fn, rt, gt), $t = bn(Jt, rt, gt) / P0, Ht = (vt - 0.5) * (0.6 + 0.8 * R) * (1 - 0.5 * Rt), Ut = Math.cos(Ht), Xt = Math.sin(Ht), Kt = St * Ut - Lt * Xt, Bt = St * Xt + Lt * Ut, Cn = It < 0.1 ? 1.35 + 0.6 * mt : 1, Kn = (w.len + w.vary * mt * mt) * h * T * Cn * $t * (1 - w.endOn + 1.25 * w.endOn * Rt);
        Cs(rt, gt, Kt, Bt, 0.1 + 0.5 * Y0(Q, 7 + v));
        let Rn = 0.22 * en(Dn, rt, gt) + 0.3 * en(zo, rt, gt);
        const go = qt < w.light * (0.4 + 0.6 * Ft[2]);
        go ? Rn += 0.2 + 0.28 * yt : qt < w.light + w.dark && (Rn -= 0.2 + 0.28 * yt), Rn += w.lift, Rn += 0.45 * (Ft[2] - 0.5) - 0.35 * Ft[8], Rn > 0 && (Rn *= 0.3 + 0.7 * Ft[2]);
        const bo = 0.15 * (1 - Ft[2]), eo = (rt + ot) * h, Hn = (gt + ot) * h, wn = (F() - 0.5) * w.bend * R * Kn, xn = yt < 0.3 ? -0.6 * wn : wn * (0.6 + 0.8 * F()), Yn = w.clump[0] + (F() * (w.clump[1] + 1) | 0), Jn = w.clumpW * h * Math.min(1.5, T);
        for (let Ao = 0; Ao < Yn; Ao++) {
          const Ln = Yn > 1 ? F() - 0.5 : 0, hn = Yn > 1 ? 0.7 + 0.3 * F() : 1, hs = Yn > 1 ? (F() - 0.5) * 0.3 : 0, Oo = eo - Bt * Ln * Jn, Po = Hn + Kt * Ln * Jn, $n = Kn * hn, Ho = wn + hs * $n, Co = xn + hs * $n - Ln * Jn * 0.7, Wo = Oo + Kt * $n * 0.33 - Bt * Ho, Yo = Po + Bt * $n * 0.33 + Kt * Ho, qo = Oo + Kt * $n * 0.67 - Bt * Co, Is = Po + Bt * $n * 0.67 + Kt * Co, C0 = Oo + Kt * $n - Bt * (xn - Ln * Jn * 0.75), Ts = Po + Bt * $n + Kt * (xn - Ln * Jn * 0.75), Nn = $n < 4 ? 2 : $n < 10 ? 3 : se;
          for (let on = 0; on <= Nn; on++) {
            const dn = on / Nn, ao = 1 - dn, fs = ao * ao * ao, ro = 3 * ao * ao * dn, Ko = 3 * ao * dn * dn, Fo = dn * dn * dn;
            $o[on] = fs * Oo + ro * Wo + Ko * qo + Fo * C0, Eo[on] = fs * Po + ro * Yo + Ko * Is + Fo * Ts;
          }
          const he = Rn + (Yn > 1 ? (F() - 0.5) * 0.25 : 0), Gn = 0.3 + 0.15 * Ft[2];
          for (let on = 0; on < Nn; on++) {
            const dn = j[Vr(he - 0.3 - bo * (1 - on / Nn) + Gn * (on + 0.5) / Nn)];
            dn.moveTo($o[on], Eo[on]), dn.lineTo($o[on + 1], Eo[on + 1]);
          }
          if (go && w.over > 0) {
            xt.moveTo($o[1], Eo[1]);
            for (let on = 2; on <= Nn; on++) xt.lineTo($o[on], Eo[on]);
          }
          if (Ao === 0 && w.shadow > 0 && Ft[2] > 0.25 && Rn > -0.2) {
            const on = w.shadow * h * Math.min(1, T), dn = J[Math.min(2, (Ft[2] - 0.25) * 4 | 0)];
            for (let ao = 1; ao <= Nn; ao++) {
              const fs = ao / Nn, ro = -ht * on * fs, Ko = -Et * on * fs + 0.3 * on * fs;
              ao === 1 && dn.moveTo($o[0], Eo[0]), dn.lineTo($o[ao] + ro, Eo[ao] + Ko);
            }
          }
          const Xo = Nn >> 1;
          if (Ft[0] > 0.3) {
            const on = Z[g0(Ft[0])];
            on.moveTo($o[Xo], Eo[Xo]);
            for (let dn = Xo + 1; dn <= Nn; dn++) on.lineTo($o[dn], Eo[dn]);
          }
          if (Ft[1] > 0.1) {
            const on = st[g0(Ft[1])];
            on.moveTo($o[Xo], Eo[Xo]);
            for (let dn = Xo + 1; dn <= Nn; dn++) on.lineTo($o[dn], Eo[dn]);
          }
        }
      }
      const ut = Math.min(1, T) ** w.short, it = Math.max(0.45, w.width * h * (0.5 + 0.5 * ut));
      if (w.over > 0 && (x.globalCompositeOperation = "destination-out", x.lineWidth = it, x.globalAlpha = w.over * ut, x.strokeStyle = "#000", x.stroke(xt), x.globalCompositeOperation = "source-over"), w.shadow > 0) {
        x.lineWidth = it * w.shadowW, x.strokeStyle = "#000";
        for (let Q = 0; Q < 3; Q++)
          x.globalAlpha = 0.03 * (Q + 1) * ut, x.stroke(J[Q]);
      }
      for (let Q = 0; Q < cs; Q++) {
        const rt = Jo + (Q / (cs - 1) * 2 - 1) * w.spread, gt = rt < Jo ? x : p;
        gt.lineWidth = it, gt.globalAlpha = w.alpha * ut * (rt < Jo ? w.deep * (1 - rt / Jo) : (rt - Jo) / (255 - Jo)), gt.strokeStyle = rt < Jo ? "#000" : "#fff", gt.stroke(j[Q]);
      }
      for (const Q of [L, S])
        Q.lineWidth = it, Q.strokeStyle = "#fff";
      for (let Q = 0; Q < To; Q++)
        L.globalAlpha = 0.4 * (Q + 0.5) / To, S.globalAlpha = 0.8 * (Q + 0.5) / To, L.stroke(Z[Q]), S.stroke(st[Q]);
      x.globalAlpha = p.globalAlpha = L.globalAlpha = S.globalAlpha = 1;
    });
  }
  const Qs = new Path2D(), ee = [];
  for (let w = 0; w < To; w++) ee.push(new Path2D());
  const Ss = [], ls = Tt / l;
  let ae = 0;
  const re = 2;
  for (let w = 0; w < re; w++) At.push(() => {
    if (w === 0) {
      for (let K = 0; K < l * l; K++) t.sd[K] > -1.6 && t.sd[K] < 2.2 && Ss.push(K);
      ae = Math.round(Ss.length * ls * ls * 24 * (0.3 + 1.4 * z) * Math.sqrt(E) * (0.5 + 0.5 * Math.min(1, o / 512)) * (1 - 0.55 * ks));
    }
    const H = Math.floor(ae * (w + 1) / re);
    for (let K = Math.floor(ae * w / re); K < H; K++) {
      const v = Ss[F() * Ss.length | 0], j = (v % l + F()) * ls - ot, Z = ((v / l | 0) + F()) * ls - ot, st = u(j, Z);
      if (st < -1.2 || st > 1.8) continue;
      const J = st + xo(j, Z);
      if (J < -0.2 || J > 1.2) continue;
      const [xt, Mt] = at(j, Z), [ut, it] = dt(j, Z), Q = (F() - 0.5) * 1.1, rt = Math.cos(Q), gt = Math.sin(Q);
      let qt = xt * rt - Mt * gt, vt = xt * gt + Mt * rt;
      const It = F(), mt = 1 + 0.5 * Y * Math.max(0, it) - 0.35 * Y * Math.max(0, -it);
      let yt = (0.3 + 1.5 * It * It * It) * h * T * (0.5 + z) * mt;
      const Ct = (j + ot) * h, St = (Z + ot) * h;
      let Lt = (F() - 0.5) * 1.17 * R * yt;
      it < -0.3 && F() < 0.06 * (0.3 + z) && (qt = ut * 0.8 + (F() - 0.5) * 0.6, vt = it * 0.8, yt *= 1.2, Lt = (F() < 0.5 ? -1 : 1) * (0.25 + 0.3 * Y) * yt), Qs.moveTo(Ct, St);
      const Rt = Ct + qt * yt * 0.5 - vt * Lt, $t = St + vt * yt * 0.5 + qt * Lt, Ht = Ct + qt * yt, Ut = St + vt * yt + Y * yt * 0.25;
      if (Qs.quadraticCurveTo(Rt, $t, Ht, Ut), Cs(j, Z, qt, vt, 0.3), Ft[1] > 0.08) {
        const Xt = ee[g0(Ft[1])];
        Xt.moveTo(Ct, St), Xt.quadraticCurveTo(Rt, $t, Ht, Ut);
      }
    }
  });
  const ce = new Path2D(), ie = [new Path2D(), new Path2D(), new Path2D()], le = [];
  for (let w = 0; w < To; w++) le.push(new Path2D());
  At.push(() => {
    const w = Ss.length * ls * ls, H = w / 3.8, K = Math.round(H / (0.45 + 0.3 * T) * (0.3 + 0.8 * z) * Math.sqrt(E) * (1 + 0.6 * ks));
    for (let v = 0, j = 0; v < K && j < 6 * K; j++) {
      const Z = Ss[F() * Ss.length | 0], st = (Z % l + F()) * ls - ot, J = ((Z / l | 0) + F()) * ls - ot, xt = F(), Mt = F(), ut = F(), it = F(), Q = u(st, J);
      if (Q < -0.5 || Q > 1.6) continue;
      const rt = Q + xo(st, J);
      if (rt < 0 || rt > 0.9 || en(Dn, st, J) < -0.4 + 0.8 * it) continue;
      v++;
      const [gt, qt] = at(st, J), [vt, It] = dt(st, J), mt = (xt - 0.5) * 0.8 * (0.5 + R), yt = Math.cos(mt), Ct = Math.sin(mt);
      let St = 0.75 * vt + 0.25 * gt, Lt = 0.75 * It + 0.25 * qt, Rt = 0.55 * gt + 0.45 * vt, $t = 0.55 * qt + 0.45 * It + 0.35 * Y;
      const Ht = Math.hypot(St, Lt) || 1, Ut = Math.hypot(Rt, $t) || 1;
      [St, Lt] = [(St * yt - Lt * Ct) / Ht, (St * Ct + Lt * yt) / Ht], [Rt, $t] = [(Rt * yt - $t * Ct) / Ut, (Rt * Ct + $t * yt) / Ut];
      const Xt = 1 + 0.5 * Y * Math.max(0, It) - 0.35 * Y * Math.max(0, -It), Kt = (0.5 + 1.1 * Mt * Mt) * h * T * (0.5 + z) * Xt, Bt = (0.3 + 0.35 * ut) * h * Math.min(1.5, T), Cn = (st + ot) * h, Kn = (J + ot) * h, Rn = Cn + St * Kt * 0.5, go = Kn + Lt * Kt * 0.5, bo = Cn + (St * 0.4 + Rt * 0.6) * Kt, eo = Kn + (Lt * 0.4 + $t * 0.6) * Kt, Hn = -Lt, wn = St;
      Cs(st, J, Rt, $t, 0.4);
      const xn = Ft[1] > 0.08 ? le[g0(Ft[1])] : null, Yn = ie[Math.min(2, Ft[2] * 3 | 0)], Jn = 4 + (F() * 5 | 0);
      for (let Ao = 0; Ao < Jn; Ao++) {
        const Ln = F() - 0.5, hn = 0.7 + 0.3 * F(), hs = (F() - 0.5) * 0.35, Oo = Cn + Hn * Ln * Bt, Po = Kn + wn * Ln * Bt, $n = Rn + Hn * Ln * Bt * 0.6, Ho = go + wn * Ln * Bt * 0.6, Co = Oo + (bo + Hn * (Ln * 0.25 + hs) * Bt - Oo) * hn, Wo = Po + (eo + wn * (Ln * 0.25 + hs) * Bt - Po) * hn;
        ce.moveTo(Oo, Po), ce.quadraticCurveTo($n, Ho, Co, Wo);
        const Yo = 0.25 * Oo + 0.5 * $n + 0.25 * Co, qo = 0.25 * Po + 0.5 * Ho + 0.25 * Wo;
        Yn.moveTo(Yo, qo), Yn.quadraticCurveTo(0.5 * ($n + Co), 0.5 * (Ho + Wo), Co, Wo), xn && (xn.moveTo(Yo, qo), xn.quadraticCurveTo(0.5 * ($n + Co), 0.5 * (Ho + Wo), Co, Wo));
      }
    }
  }), At.push(() => {
    const w = Math.max(0.4, 0.11 * h);
    x.lineWidth = p.lineWidth = S.lineWidth = w, x.globalCompositeOperation = "destination-out", x.globalAlpha = 0.6, x.strokeStyle = "#000", p.strokeStyle = "#fff";
    for (let H = 0; H < 3; H++)
      x.stroke(ie[H]), p.globalAlpha = 0.08 + 0.11 * H, p.stroke(ie[H]);
    x.globalCompositeOperation = "source-over", S.strokeStyle = "#fff";
    for (let H = 0; H < To; H++)
      S.globalAlpha = (H + 0.5) / To, S.stroke(le[H]);
    x.globalAlpha = p.globalAlpha = S.globalAlpha = 1, p.lineWidth = x.lineWidth = Math.max(0.35, 0.08 * h), p.globalAlpha = 0.5 * ((140 - Jo) / (255 - Jo)), p.strokeStyle = "#fff", p.stroke(Qs), p.globalAlpha = 1, S.lineWidth = p.lineWidth, S.strokeStyle = "#fff";
    for (let H = 0; H < To; H++)
      S.globalAlpha = (H + 0.5) / To, S.stroke(ee[H]);
    S.globalAlpha = 1, x.globalCompositeOperation = "destination-out", x.globalAlpha = 0.7, x.strokeStyle = "#000", x.stroke(Qs), x.globalAlpha = 1, x.globalCompositeOperation = "source-over";
  });
  const je = new ImageData(o, o), Ze = new ImageData(o, o), Ve = new ImageData(o, o), b0 = 0.5 + 1.2 * z, Nr = b0 + An, Ur = e1 * (1 - 0.6 * ks), Qr = a1 * (1 + 1.2 * ks), Js = Math.max(1, Math.round(r1 * T * h)), A0 = Js + 1, Jr = ko * Math.sqrt(1 + Js * (2 * Js + 1) / (3 * A0)) / A0, Ne = Math.round(vo * h);
  return D(o, 64, (w, H) => {
    const K = je.data, v = Ze.data, j = Ve.data;
    for (let Z = w; Z < H; Z++) {
      const st = (Z + 0.5) / h - ot;
      for (let J = 0; J < o; J++) {
        const xt = (J + 0.5) / h - ot, Mt = (Z * o + J) * 4;
        K[Mt] = K[Mt + 1] = K[Mt + 2] = v[Mt] = v[Mt + 1] = v[Mt + 2] = 255;
        const ut = u(xt, st);
        if (ut >= An + Ie) {
          K[Mt + 3] = j[Mt + 3] = 255;
          continue;
        }
        const it = ut <= -Nr ? ut : ut + xo(xt, st);
        if (it >= 0) {
          K[Mt + 3] = 255, j[Mt + 3] = Math.round(255 * mn(0.25 * Ie, Ie, it));
          continue;
        }
        const Q = Math.min(1, -it / (2 * b0)), rt = bn(Sn, xt, st) * q[0] + bn(rn, xt, st) * q[1];
        if (v[Mt + 3] = Math.round(255 * c1 * Q * Q * (3 - 2 * Q) * (0.45 + 0.55 * mn(-0.3, 0.6, rt))), it <= -b0) continue;
        const gt = 1 + it / b0, qt = gt * gt * (3 - 2 * gt), [vt, It] = Qn(xt, st);
        let mt = 0;
        for (let Ct = -Js; Ct <= Js; Ct++) {
          const St = Math.round(J + Ne + vt * Ct), Lt = Math.round(Z + Ne + It * Ct);
          mt += (St < 0 || Lt < 0 || St >= f || Lt >= f ? Qo : Ds[Lt * f + St]) * (1 - Math.abs(Ct) / A0);
        }
        const yt = (mt / A0 - Qo) / Jr;
        K[Mt + 3] = Math.round(255 * Math.max(0, Math.min(1, qt * (Ur + Qr * yt))));
      }
    }
  }), At.push(() => {
    const w = En(o), H = w && kn(w, !1);
    w && H && (H.putImageData(Ze, 0, 0), b.haze = w), k.putImageData(je, 0, 0), k.lineCap = "round", k.lineWidth = Math.max(0.35, 0.08 * h), k.strokeStyle = "rgba(255,255,255,0.45)", k.stroke(Qs), k.lineWidth = Math.max(0.4, 0.11 * h), k.strokeStyle = "rgba(255,255,255,0.8)", k.stroke(ce);
    const K = En(o), v = K && kn(K, !1);
    K && v && (v.putImageData(Ve, 0, 0), b.core = K), b.dark = M, b.light = y, b.glint = A, b.back = g, b.backSoft = I, b.mask = m, i(b);
  }), { steps: At };
}
function m1(t) {
  if (t.cut || !t.mask) return t.cut;
  const n = t.mask.width, o = En(n), s = o && kn(o, !1);
  return o && s && (s.fillRect(0, 0, n, n), s.globalCompositeOperation = "destination-out", s.drawImage(t.mask, 0, 0), t.cut = o), t.cut;
}
function y1(t, n, o, s) {
  const { V: a, U: e, D: r } = o, i = s.vivid ?? 0, l = [0, 0, 0], h = $r(e, a, s.front), d = Er(o.K, a), u = Math.max(0.03, 0.2 - 0.15 * s.shadow), c = Math.max(0.04, 0.24 - 0.13 * s.shadow), f = Math.min(0.7, 0.05 + 0.12 * s.spread), b = 1.3, M = 0.34 * Math.min(1.6, s.shadow / 0.35), y = ss([-0.55 * e[0] + 0.85 * a[0] + 0.15 * r[0], -0.55 * e[1] + 0.85 * a[1] + 0.15 * r[1], -0.55 * e[2] + 0.85 * a[2] + 0.15 * r[2]]), m = s.sheen ?? 0, A = Math.min(1, Math.max(0, s.backSoft ?? N0)), g = 0.16 * s.highlight * m, I = 1.15 * s.rim * m, x = 0.2 + 0.25 * i, p = Math.max(n[0], n[1], n[2], 0.02), k = [n[0] / p, n[1] / p, n[2] / p], L = [k[0], k[1], k[2]], S = 0.45 * (1 - i), O = 0.25 * (1 - i), F = [S + (1 - S) * k[0], S + (1 - S) * k[1], S + (1 - S) * k[2]], W = [O + (1 - O) * k[0], O + (1 - O) * k[1], O + (1 - O) * k[2]], C = (R) => 0.2126 * R[0] + 0.7152 * R[1] + 0.0722 * R[2], $ = 1.8 + 2.2 * i, T = [Math.pow(n[0], $), Math.pow(n[1], $), Math.pow(n[2], $)], E = C(n) / Math.max(1e-4, C(T)), z = [T[0] * E, T[1] * E, T[2] * E], B = [k[0] * k[0] * n[0], k[1] * k[1] * n[1], k[2] * k[2] * n[2]];
  for (let R = 0; R < jn; R++)
    for (let Y = 0; Y < jn; Y++) {
      let et = Y / (jn - 1) * 2 - 1, ht = R / (jn - 1) * 2 - 1, Et = et * et + ht * ht;
      if (Et > 1.14) continue;
      if (Et > 1) {
        const Dt = 1 / Math.sqrt(Et);
        et *= Dt, ht *= Dt, Et = 1;
      }
      const Pt = Math.sqrt(1 - Et), Ot = et * h[0] + ht * h[1] + Pt * h[2], Gt = Math.max(0, et * a[0] + ht * a[1] + Pt * a[2]), P = et * r[0] + ht * r[1] + Pt * r[2], q = et * d[0] + ht * d[1] + Pt * d[2], V = 1 - Gt, bt = f + (0.45 - f) * V * V;
      let G = Math.min(1, Math.max(0, (Ot + bt) / (1 + bt)));
      G = Math.pow(G, 1.35);
      const N = c * Math.max(0, et * y[0] + ht * y[1] + Pt * y[2]), dt = 1 - M * Math.max(0, P) * (0.6 + 0.4 * V), at = (u + b * G + N) * dt, At = Math.min(1, Math.max(0, 1 - at)), D = Math.max(0, 1 - (Ot + 0.08) * (Ot + 0.08) / 0.18), ft = x * D * D * dt, Yt = Math.min(1, Math.max(0, (Ot + 0.2) / 0.8)), _ = g * V * V * Yt, wt = mn(-0.3, 0.6, q), pn = mn(0.18 - 0.12 * A, 0.62 + 0.18 * A, V), gn = I * pn * Math.sqrt(pn) * (0.3 + 0.7 * wt) * (1 - 0.7 * Math.max(0, P)), fn = pn * pn * Math.sqrt(pn) * (1 - 0.5 * A), Sn = (R * jn + Y) * 3;
      let rn = 0, Mn = 0, jt = 0;
      for (let Dt = 0; Dt < 3; Dt++) {
        const Wn = (n[Dt] + (z[Dt] - n[Dt]) * At * 0.9) * at + ft * B[Dt] + _ * W[Dt] + gn * (L[Dt] + (F[Dt] - L[Dt]) * fn);
        Dt === 0 ? rn = Wn : Dt === 1 ? Mn = Wn : jt = Wn;
      }
      const Qt = Math.max(rn, Mn, jt);
      if (Qt > 0.8) {
        const Dt = (0.8 + 0.2 * (1 - Math.exp(-(Qt - 0.8) / 0.2))) / Qt;
        rn *= Dt, Mn *= Dt, jt *= Dt;
      }
      i > 0 && (l[0] = rn, l[1] = Mn, l[2] = jt, kr(l, i, 1), [rn, Mn, jt] = l), t[Sn] = io(rn), t[Sn + 1] = io(Mn), t[Sn + 2] = io(jt);
    }
}
const g1 = 0.28, b1 = 0.42, $a = /* @__PURE__ */ new WeakMap();
function A1(t, n, o = 0) {
  const s = t.dark;
  if (!s) return null;
  let a = $a.get(t);
  a || $a.set(t, a = /* @__PURE__ */ new Map());
  const e = Math.round(Math.min(1, o) * 10) / 10, r = `${n}|${e}`, i = a.get(r);
  if (i !== void 0) return i;
  const l = En(s.width), h = l && kn(l, !1);
  if (l && h) {
    const d = Os(n), u = [io(d[0]) / 255, io(d[1]) / 255, io(d[2]) / 255], c = Math.max(u[0], u[1], u[2], 1e-3), f = 0.2126 * u[0] + 0.7152 * u[1] + 0.0722 * u[2], b = Math.min(u[0], u[1], u[2]) / c, M = g1 + b1 * f * f * b, y = (x) => Math.round(255 * M * x * Math.pow(x / c, 3.2 + 3 * e)), m = y(u[0]), A = y(u[1]), g = y(u[2]), I = (0.2126 * m + 0.7152 * A + 0.0722 * g) / 255 / Math.max(1e-3, f);
    h.globalAlpha = Math.min(1, Math.sqrt((1 - Lr) / Math.max(0.05, 1 - I))), h.drawImage(s, 0, 0), h.globalAlpha = 1, h.globalCompositeOperation = "source-in", h.fillStyle = `rgb(${m} ${A} ${g})`, h.fillRect(0, 0, s.width, s.height);
  }
  return a.size >= 4 && a.clear(), a.set(r, l && h ? l : null), l && h ? l : null;
}
const Ea = 0.6, Oa = /* @__PURE__ */ new WeakMap();
function C1(t, n, o) {
  const s = t.light;
  if (!s) return null;
  const a = Math.round((Ea + (1 - Ea) * Math.min(1, Math.max(0, o))) * 10) / 10, e = `${n}|${a}`;
  let r = Oa.get(t);
  r || Oa.set(t, r = /* @__PURE__ */ new Map());
  const i = r.get(e);
  if (i !== void 0) return i;
  const l = En(s.width), h = l && kn(l, !1);
  if (l && h) {
    h.drawImage(s, 0, 0), h.globalCompositeOperation = "source-in";
    const d = Os(n), u = [io(d[0]), io(d[1]), io(d[2])], c = Math.max(u[0], u[1], u[2], 1), f = (b) => Math.round(255 + (255 * b / c - 255) * Math.min(1, a));
    h.fillStyle = `rgb(${f(u[0])} ${f(u[1])} ${f(u[2])})`, h.fillRect(0, 0, s.width, s.height);
  }
  return r.size >= 6 && r.clear(), r.set(e, l && h ? l : null), l && h ? l : null;
}
const Wa = /* @__PURE__ */ new WeakMap();
function w1(t, n, o) {
  const s = t.glint, a = t.back;
  if (!s || !a) return null;
  const e = Math.min(1, 0.45 * o.highlight * (o.shine ?? 0)), r = Math.min(1, 1.1 * o.rim);
  if (e <= 0.01 && r <= 0.01) return null;
  const i = Math.min(1, o.vivid ?? 0), l = Math.min(1, Math.max(0, Math.round((o.backSoft ?? N0) * 20) / 20)), h = `${n}|${e.toFixed(2)}|${r.toFixed(2)}|${i.toFixed(1)}|${l}`;
  let d = Wa.get(t);
  d || Wa.set(t, d = /* @__PURE__ */ new Map());
  const u = d.get(h);
  if (u !== void 0) return u;
  const c = s.width, f = En(c), b = f && kn(f, !1), M = En(c), y = M && kn(M, !1);
  if (f && b && M && y) {
    const m = Os(n), A = [io(m[0]), io(m[1]), io(m[2])], g = Math.max(A[0], A[1], A[2], 1), I = (p) => `rgb(${[0, 1, 2].map((k) => Math.round(255 + (255 * A[k] / g - 255) * p)).join(" ")})`, x = [
      [a, I(0.65 + 0.35 * i), r * (1 - 0.85 * l)],
      [t.backSoft, I(0.7 + 0.3 * i), r * l],
      [s, I(0.45 + 0.55 * i), e]
    ];
    for (const [p, k, L] of x)
      p && (L <= 0.01 || (y.globalCompositeOperation = "copy", y.drawImage(p, 0, 0), y.globalCompositeOperation = "source-in", y.fillStyle = k, y.fillRect(0, 0, c, c), b.globalAlpha = L, b.drawImage(M, 0, 0)));
    b.globalAlpha = 1;
  }
  return d.size >= 6 && d.clear(), d.set(h, f && b ? f : null), f && b ? f : null;
}
const ss = (t) => {
  const n = Math.hypot(t[0], t[1], t[2]) || 1;
  return [t[0] / n, t[1] / n, t[2] / n];
};
function x1(t) {
  const n = Math.cos(t.roll), o = Math.sin(t.roll), s = n * t.lx + o * t.ly, a = -o * t.lx + n * t.ly, e = t.facing < 0 ? -1 : 1, r = e * Math.min(1, Math.abs(t.facing) / 0.16), { cy: i, sy: l, cp: h, sp: d } = t, u = ($, T, E, z = r) => ss([i * $ + l * d * T - l * h * E, h * T + d * E, z * (l * $ - i * d * T + i * h * E)]), c = u(da * s, da * a, Sc), f = u(0, 0, 1, e), b = ss([c[0] + f[0], c[1] + f[1], c[2] + f[2]]), M = u(s, a, 0, e), y = Math.cos(80 * Math.PI / 180), m = Math.sin(80 * Math.PI / 180), A = y * s - m * a, g = m * s + y * a, I = ss([0.55 * A, 0.55 * g, 0.83]), x = ss([I[1], -I[0], 0]), p = [I[1] * x[2] - I[2] * x[1], I[2] * x[0] - I[0] * x[2], I[0] * x[1] - I[1] * x[0]], k = u(I[0], I[1], I[2], e), L = u(x[0], x[1], x[2], e), S = u(p[0], p[1], p[2], e), O = u(o, n, 0, e), [F, W] = t.bx !== void 0 && t.by !== void 0 ? [t.bx, t.by] : ze(t.lx, t.ly), C = u(n * F + o * W, -o * F + n * W, 0, e);
  return { L: c, V: f, H: b, U: M, W: k, A: L, B: S, D: O, K: C };
}
const qa = /* @__PURE__ */ new WeakMap();
function k1(t, n) {
  const o = t.canvas ?? t;
  let s = qa.get(o);
  s || (s = /* @__PURE__ */ new Map(), qa.set(o, s));
  let a = s.get(n);
  return a || (a = {
    N: 0,
    img: null,
    mc: new Float32Array(_0 * 3),
    mcPrev: new Float32Array(_0 * 3),
    mcMix: new Float32Array(_0 * 3),
    mixVersion: 0,
    blendT: 1,
    blendFrames: 1,
    sinceBuild: 0,
    L: null,
    V: null,
    lx: NaN,
    ly: NaN,
    base: "",
    shadow: NaN,
    highlight: NaN,
    spread: NaN,
    rim: NaN,
    vivid: NaN,
    front: NaN,
    sheen: NaN,
    backSoft: NaN,
    K: null,
    version: 0,
    imgVersion: -1,
    imgAoK: NaN,
    imgForm: null,
    aoK: -1,
    aoMul: new Float32Array(256),
    scratch: [null, null],
    scratchIdx: 0,
    scratchN: 0,
    scratchStale: !0,
    sprites: [null, null, null, null, null],
    sliceG: [],
    sliceIns: [],
    sliceSpr: /* @__PURE__ */ new Map(),
    sliceSprKey: "",
    sliceSprMade: /* @__PURE__ */ new Set(),
    sliceKey: "",
    body: [null, null],
    bodyIdx: 0,
    spriteVersion: -1,
    spritePx: 0,
    spriteFur: null,
    miss: [0, 0],
    missAt: [0, 0],
    turnAt: [0, 0],
    fade: null,
    lay: 1,
    layTmp: null,
    haloTmp: null
  }, s.size > 4 && s.clear(), s.set(n, a)), a;
}
const Te = 1 / 48, Pe = (t, n) => !n || Math.abs(t[0] - n[0]) >= Te || Math.abs(t[1] - n[1]) >= Te || Math.abs(t[2] - n[2]) >= Te;
function Hs(t, n) {
  return [
    t[0] * n[0] + t[2] * n[1],
    t[1] * n[0] + t[3] * n[1],
    t[0] * n[2] + t[2] * n[3],
    t[1] * n[2] + t[3] * n[3],
    t[0] * n[4] + t[2] * n[5] + t[4],
    t[1] * n[4] + t[3] * n[5] + t[5]
  ];
}
function va(t, n, o) {
  const { N: s, sd: a } = n, e = t.data, r = (h) => (h + ot) / Tt * s - 0.5, i = [], l = [];
  for (let h = 0; h < Do; h++) {
    const d = h / Do * Math.PI * 2, u = Math.cos(d), c = Math.sin(d), f = [], b = [];
    for (let M = 0; M < 80; M += 0.5) {
      const y = o[0] + u * M, m = o[1] + c * M, A = ys(a, s, r(y), r(m));
      if (A < 0) break;
      const g = Math.round(r(y)), I = Math.round(r(m));
      if (g < 0 || I < 0 || g >= s || I >= s) break;
      const x = (I * s + g) * 4;
      f.push(A), b.push(e[x], e[x + 1], e[x + 2]);
    }
    i.push(Float32Array.from(f)), l.push(Float32Array.from(b));
  }
  return { d: i, c: l };
}
function Da(t, n, o, s, a, e, r) {
  const i = (d) => {
    const u = n.d[d], c = n.c[d], f = typeof o == "number" ? o : o[d], b = 1 - (typeof s == "number" ? s : s[d]);
    let M = 0;
    for (let y = 0; y < u.length; y++) u[y] >= f && (M = y);
    return c.length ? `rgb(${c[M * 3] * b | 0} ${c[M * 3 + 1] * b | 0} ${c[M * 3 + 2] * b | 0})` : "rgb(0 0 0)";
  };
  if (!r && typeof t.createConicGradient == "function") {
    const d = t.createConicGradient(0, a[0], a[1]);
    for (let u = 0; u <= Do; u++) d.addColorStop(u / Do, i(u % Do));
    return d;
  }
  const l = t.createLinearGradient(a[0] + e[0] * 50, a[1] + e[1] * 50, a[0] - e[0] * 50, a[1] - e[1] * 50), h = (d) => Math.round((d % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2 / Do)) % Do;
  return l.addColorStop(0, i(h(Math.atan2(e[1], e[0])))), l.addColorStop(0.5, i(h(Math.atan2(e[0], -e[1])))), l.addColorStop(1, i(h(Math.atan2(-e[1], -e[0])))), l;
}
function S1(t, n, o, s = 0) {
  const a = /rgb\((\d+) (\d+) (\d+)\)/.exec(I1(t)), e = a ? [+a[1], +a[2], +a[3]] : [255, 255, 255], r = Os(n), i = [io(r[0]), io(r[1]), io(r[2])], l = Math.max(i[0], i[1], i[2], 1), h = Math.min(0.85, 0.75 * o), d = 0.45 + 0.55 * Math.min(1, s), u = (c) => Math.round(e[c] + (255 + (255 * i[c] / l - 255) * d - e[c]) * h);
  return `rgb(${u(0)} ${u(1)} ${u(2)})`;
}
function I1(t) {
  let n = -1, o = 0, s = 0, a = 0;
  for (const r of t.c)
    for (let i = 0; i < r.length; i += 3) {
      const l = 0.2126 * r[i] + 0.7152 * r[i + 1] + 0.0722 * r[i + 2];
      l > n && (n = l, o = r[i], s = r[i + 1], a = r[i + 2]);
    }
  const e = (r) => Math.min(255, Math.round(r / 4) * 4);
  return `rgb(${e(o)} ${e(s)} ${e(a)})`;
}
function ve(t, n, o, s, a, e, r, i, l) {
  const h = e * t.cx[0] + r * t.cy[0], d = (e * o + r * s) * a;
  let u = i, c = 0, f = !1;
  for (let b = 1; b < n; b++) {
    const M = e * t.cx[b] + r * t.cy[b] + t.scale[b] * (i - h);
    M + t.z[b] * d > u && (u = M + t.z[b] * d, c = b, f = !1), M - t.z[b] * d > u && (u = M - t.z[b] * d, c = b, f = !0);
  }
  return l && (l.k = c, l.far = f), u;
}
function T1(t, n, o, s, a, e) {
  if (e <= 1e-4) return [1, 0, 0, 1, 0, 0];
  const r = J0(t), i = V0(r, s, a), l = V0(r, -s, -a), h = ve(n, o, s, a, e, s, a, i), d = ve(n, o, s, a, e, -s, -a, l), u = (h + d) / Math.max(1, i + l) - 1, c = h - (u + 1) * i;
  return [1 + u * s * s, u * s * a, u * s * a, 1 + u * a * a, s * c, a * c];
}
function P1(t, n, o, s, a, e, r, i) {
  const l = J0(t), h = new Float32Array(Do), d = new Float32Array(Do), u = r[0] + r[3] - 2, c = { k: 0, far: !1 };
  for (let f = 0; f < Do; f++) {
    const b = f / Do * Math.PI * 2, M = Math.cos(b), y = Math.sin(b), m = M * s + y * a, A = u / (1 + u);
    let g = M - A * m * s, I = y - A * m * a;
    const x = Math.hypot(g, I);
    g /= x, I /= x, ve(n, o, s, a, e, g, I, V0(l, g, I), c), h[f] = Math.max(qe, n.inset[c.k]), d[f] = c.far ? i1 * i * (1 - Math.exp(-2.4 * (c.k / o))) : 0;
  }
  return { inset: h, dark: d };
}
const _a = /* @__PURE__ */ new WeakMap(), co = 96, Ys = 0.1;
function F1(t, n, o, s, a, e, r, i) {
  const l = `${s}|${o.q}|${Math.round(e / Ys)}|${Math.round(r / Ys)}`;
  let h = _a.get(t);
  h || _a.set(t, h = /* @__PURE__ */ new Map());
  const d = h.get(l);
  if (d || d === null && !i) return d ?? null;
  if (h.size > 256 && h.clear(), !i)
    return h.set(l, null), _e(() => {
      h.set(l, za(t, n, o, s, a, e, r));
    }), null;
  const u = za(t, n, o, s, a, e, r);
  return h.set(l, u), u;
}
function za(t, n, o, s, a, e, r) {
  const i = En(co), l = i && kn(i, !0);
  if (!l) return [0, 0];
  const h = Tt / co, d = a[0] * a[3] - a[1] * a[2], u = a[3] / d, c = -a[1] / d, f = -a[2] / d, b = a[0] / d, M = -(u * a[4] + f * a[5]), y = -(c * a[4] + b * a[5]);
  l.fillStyle = "#fff";
  for (let p = 0; p < s; p++)
    for (const k of p ? [o.z[p], -o.z[p]] : [0]) {
      l.setTransform(1 / h, 0, 0, 1 / h, ot / h, ot / h), l.transform(u, c, f, b, M, y), l.translate(k * e, k * r);
      const L = o.scale[p];
      p && l.transform(L, 0, 0, L, o.cx[p] - L * o.cx[0], o.cy[p] - L * o.cy[0]), l.fill(n);
    }
  const m = l.getImageData(0, 0, co, co).data, A = new Uint8Array(co * co), g = new Float32Array(co * co);
  for (let p = 0; p < co * co; p++) A[p] = m[p * 4 + 3] > 127 ? 1 : 0;
  Oe(A, 1, co, g, null);
  let I = 0, x = 0;
  for (let p = 0, k = 0; p < co; p++)
    for (let L = 0; L < co; L++, k++) {
      const S = ys(t.sd, t.N, (L + 0.5) / co * t.N - 0.5, (p + 0.5) / co * t.N - 0.5);
      A[k] && S < 0 && (I = Math.max(I, -S)), !A[k] && S > 0 && (x = Math.max(x, Math.sqrt(g[k]) * h));
    }
  return [I, x];
}
const Fe = typeof navigator < "u" && /AppleWebKit\//.test(navigator.userAgent) && !/Chrome\/|Chromium\/|Edg\//.test(navigator.userAgent), L1 = typeof navigator < "u" && /Firefox\//.test(navigator.userAgent);
function $1(t, n, o, s, a, e) {
  const r = Ar(o.dev), i = br(n.typeKey ?? Me(n.path), n.path, r, o.halfDepth, !!o.still);
  if (!i) return !1;
  const l = n.shading === "fabric", h = Math.ceil(Tt * o.dev / 100), d = (() => {
    const [X, nt] = o.bx !== void 0 && o.by !== void 0 ? [o.bx, o.by] : ze(o.lx, o.ly);
    return { bx: X, by: nt, front: e.front ?? c0 };
  })(), u = l ? Re(i, n.typeKey ?? Me(n.path), o.halfDepth, h, !!o.still && !n.furOnIdle, o.lx, o.ly, n.fur ?? bs, d) : null;
  if (l && !u) return !1;
  const c = k1(t, (n.typeKey ?? Me(n.path)) + (l ? "|fabric" : "")), f = x1(o), b = (() => {
    const X = Math.hypot(f.L[0], f.L[1]);
    return X < 0.05 ? [0, -1] : [f.L[0] / X, f.L[1] / X];
  })();
  if ((Pe(f.L, c.L) || Pe(f.V, c.V) || o.lx !== c.lx || o.ly !== c.ly || s.base !== c.base || e.shadow !== c.shadow || e.highlight !== c.highlight || e.spread !== c.spread || e.rim !== c.rim || (e.vivid ?? 0) !== c.vivid || (e.front ?? c0) !== c.front || (e.sheen ?? 0) !== c.sheen || (e.backSoft ?? N0) !== c.backSoft || l && Pe(f.K, c.K)) && (c.version > 0 && c.mcPrev.set(c.mcMix), l ? y1(c.mc, Os(s.base), f, e) : Dc(c.mc, Os(s.base), f, e), c.version === 0 || o.still ? (c.mcMix.set(c.mc), c.blendT = 1) : (c.blendFrames = Math.min(10, Math.max(1, c.sinceBuild)), c.blendT = 0), c.sinceBuild = 0, c.mixVersion++, c.L = f.L, c.V = f.V, c.lx = o.lx, c.ly = o.ly, c.base = s.base, c.shadow = e.shadow, c.highlight = e.highlight, c.spread = e.spread, c.rim = e.rim, c.vivid = e.vivid ?? 0, c.front = e.front ?? c0, c.sheen = e.sheen ?? 0, c.backSoft = e.backSoft ?? N0, c.K = f.K, c.version++), c.sinceBuild++, c.blendT < 1) {
    c.blendT = Math.min(1, c.blendT + 1 / c.blendFrames);
    const X = c.blendT >= 1 ? 1 : c.blendT * c.blendT * (3 - 2 * c.blendT), nt = c.mcPrev, ct = c.mc, U = c.mcMix;
    for (let tt = 0; tt < _0 * 3; tt++) U[tt] = nt[tt] + (ct[tt] - nt[tt]) * X;
    c.mixVersion++;
  }
  const M = u ? Math.min(1.2, 0.3 + 0.8 * e.shadow) : Math.min(1.3, 1.2 * e.shadow);
  if (M !== c.aoK) {
    for (let X = 0; X < 256; X++) c.aoMul[X] = Math.max(0, 1 - M * (1 - X / 255));
    c.aoK = M;
  }
  if ((!c.img || c.N !== r) && (c.img = new ImageData(r, r), c.N = r, c.imgVersion = -1), (c.imgVersion !== c.mixVersion || c.imgAoK !== M || c.imgForm !== i) && (zc(i, c.mcMix, c.img.data, c.aoMul, u ? _c(i) : void 0), c.imgVersion = c.mixVersion, c.imgAoK = M, c.imgForm = i, c.scratchStale = !0), c.scratchN !== r && (c.scratch = [null, null], c.scratchN = r, c.scratchStale = !0), c.scratchStale) {
    c.scratchIdx ^= 1;
    let X = c.scratch[c.scratchIdx];
    if (!X) {
      const nt = En(r), ct = nt && kn(nt, !1);
      if (!nt || !ct) return !1;
      X = c.scratch[c.scratchIdx] = { c: nt, g: ct };
    }
    X.g.putImageData(c.img, 0, 0), c.scratchStale = !1;
  }
  const m = c.scratch[c.scratchIdx].c, A = o.dev <= 100 ? 14 : o.dev <= 224 ? 20 : 26, g = qc(i, A, o.round ?? 1), { cy: I, sy: x, cp: p, sp: k } = o, [L, S, O, F, W, C] = o.ctm, $ = x * k, T = L * I + O * $, E = S * I + F * $, z = O * p, B = F * p;
  t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high";
  const R = o.facing >= 0 ? 1 : -1, Y = x / I, et = -k / (I * p), ht = Math.hypot(Y, et);
  let Et = 50;
  for (let X = 1; X < A; X++) Et = Math.max(Et, 50 * g.scale[X] + g.z[X] * ht);
  const Pt = ht > 1e-6 ? R * Y / ht : 1, Ot = ht > 1e-6 ? R * et / ht : 0, Gt = Math.min(0.7, 0.55 * Math.min(1.6, e.shadow / 0.35)), P = u ? T1(i, g, A, Pt, Ot, ht) : null, q = Math.ceil(Tt * o.dev / 100);
  if (c.spritePx !== q && (c.sprites = [null, null, null, null, null], c.spritePx = q, c.spriteVersion = -1), c.spriteVersion !== c.version || c.spriteFur !== u) {
    const X = q / Tt, nt = u ? Rc(i, u.R) : null, ct = va(c.img, i, [g.cx[0], g.cy[0]]);
    for (let U = 0; U < 4; U++) {
      if (U === 2) continue;
      let tt = c.sprites[U];
      if (!tt) {
        const lt = En(q), yn = lt && kn(lt, !1);
        if (!lt || !yn) return !1;
        tt = c.sprites[U] = { c: lt, g: yn };
      }
      const pt = tt.g;
      pt.setTransform(1, 0, 0, 1, 0, 0), pt.globalCompositeOperation = "source-over", pt.clearRect(0, 0, q, q), pt.imageSmoothingEnabled = !0, pt.imageSmoothingQuality = "high";
      const nn = U === 0 && u && u.mask ? u : null;
      nn && nn.haze && (pt.imageSmoothingQuality = "low", pt.drawImage(nn.haze, 0, 0, q, q), pt.imageSmoothingQuality = "high", pt.globalCompositeOperation = "source-in", pt.fillStyle = S1(ct, s.base, e.rim, e.vivid ?? 0), pt.fillRect(0, 0, q, q), pt.globalCompositeOperation = "destination-over"), pt.setTransform(X, 0, 0, X, ot * X, ot * X);
      const Wt = nn && P ? P1(i, g, A, Pt, Ot, ht, P, Gt) : null;
      pt.fillStyle = U === 1 ? "#000" : Da(pt, ct, Wt ? Wt.inset : u ? Math.max(qe, g.inset[0]) : g.inset[0], Wt ? Wt.dark : 0, [g.cx[0], g.cy[0]], b, Fe), u && u.mask ? (pt.fillRect(-ot, -ot, Tt, Tt), pt.setTransform(1, 0, 0, 1, 0, 0), pt.globalCompositeOperation = "destination-in", pt.drawImage((U === 0 ? u.mask : nt) ?? u.mask, 0, 0, q, q), pt.globalCompositeOperation = "source-over") : pt.fill(n.path);
    }
    if (u && u.core) {
      let U = c.sprites[4];
      if (!U) {
        const tt = En(q), pt = tt && kn(tt, !1);
        tt && pt && (U = c.sprites[4] = { c: tt, g: pt });
      }
      U && (U.g.setTransform(1, 0, 0, 1, 0, 0), U.g.globalCompositeOperation = "copy", U.g.drawImage(c.sprites[0].c, 0, 0), U.g.globalCompositeOperation = "destination-out", U.g.drawImage(u.core, 0, 0, q, q), U.g.globalCompositeOperation = "source-over");
    }
    c.spriteVersion = c.version, c.spriteFur = u;
  }
  const V = (Et + 50) / 100, bt = (Et - 50) / 2, G = 1 + (V - 1) * Pt * Pt, N = (V - 1) * Pt * Ot, dt = 1 + (V - 1) * Ot * Ot, at = Hs(Hs(o.ctm, [I, $, 0, p, 0, 0]), [G, N, N, dt, bt * Pt - 50 * G - 50 * N, bt * Ot - 50 * N - 50 * dt]), At = u != null && u.dark && u.light ? u : null;
  let D = t, ft = 0, Yt = 0, _ = 0, wt = 0;
  if (At) {
    let X = 1 / 0, nt = 1 / 0, ct = -1 / 0, U = -1 / 0;
    for (const pt of [-g.top, g.top]) {
      const nn = pt * x - 50 * I, Wt = -pt * I * k - 50 * $ - 50 * p, lt = L * nn + O * Wt + W, yn = S * nn + F * Wt + C;
      for (const tn of [-ot, 100 + ot]) for (const an of [-ot, 100 + ot]) {
        const In = T * tn + z * an + lt, cn = E * tn + B * an + yn;
        In < X && (X = In), In > ct && (ct = In), cn < nt && (nt = cn), cn > U && (U = cn);
      }
    }
    ft = Math.floor(X) - 1, Yt = Math.floor(nt) - 1, _ = Math.ceil(ct) + 1 - ft, wt = Math.ceil(U) + 1 - Yt, c.bodyIdx ^= 1;
    let tt = c.body[c.bodyIdx];
    if (!tt || tt.w < _ || tt.h < wt || tt.w > 2 * _ + 64 || tt.h > 2 * wt + 64) {
      const pt = Math.ceil(_ / 64) * 64, nn = Math.ceil(wt / 64) * 64;
      let Wt = null;
      typeof document < "u" ? (Wt = document.createElement("canvas"), Wt.width = pt, Wt.height = nn) : typeof OffscreenCanvas < "u" && (Wt = new OffscreenCanvas(pt, nn));
      const lt = Wt && kn(Wt, !1);
      tt = Wt && lt ? c.body[c.bodyIdx] = { c: Wt, g: lt, w: Wt.width, h: Wt.height } : null;
    }
    tt ? (D = tt.g, D.setTransform(1, 0, 0, 1, 0, 0), D.globalCompositeOperation = "source-over", D.globalAlpha = 1, D.clearRect(0, 0, _, wt), D.imageSmoothingEnabled = !0, D.imageSmoothingQuality = "high") : ft = Yt = 0;
  }
  const pn = (X) => {
    const nt = X * x - 50 * I, ct = -X * I * k - 50 * $ - 50 * p;
    D.setTransform(T, E, z, B, L * nt + O * ct + W - ft, S * nt + F * ct + C - Yt);
  }, [gn, fn, , Sn] = c.sprites, rn = [g.cx[0], g.cy[0]], Mn = `${c.version}|${A}|${g.q}`;
  if (c.sliceKey !== Mn) {
    const X = va(c.img, i, rn);
    c.sliceG = [], c.sliceIns = [];
    for (let nt = 0; nt < A; nt++) {
      const ct = u ? Math.max(qe, g.inset[nt]) : g.inset[nt];
      c.sliceIns.push(ct), c.sliceG.push(Da(t, X, ct, 0, rn, b, Fe));
    }
    c.sliceKey = Mn;
  }
  const jt = L1 && typeof document < "u", Qt = `${Mn}|${q}`;
  jt && c.sliceSprKey !== Qt && (c.sliceSprKey = Qt, c.sliceSprMade = /* @__PURE__ */ new Set(), c.sliceSpr.size > 32 && c.sliceSpr.clear());
  const Dt = (X) => {
    const nt = c.sliceIns[X];
    let ct = c.sliceSpr.get(nt);
    if (ct && c.sliceSprMade.has(nt)) return ct;
    if (!ct || ct.c.width !== q) {
      const tt = document.createElement("canvas");
      tt.width = tt.height = q;
      const pt = tt.getContext("2d");
      if (!pt) return;
      ct = { c: tt, g: pt }, c.sliceSpr.set(nt, ct);
    }
    const U = q / Tt;
    return ct.g.setTransform(1, 0, 0, 1, 0, 0), ct.g.clearRect(0, 0, q, q), ct.g.setTransform(U, 0, 0, U, ot * U, ot * U), ct.g.fillStyle = c.sliceG[X], ct.g.fill(n.path), c.sliceSprMade.add(nt), ct;
  }, Jt = (X, nt, ct) => {
    pn(nt);
    const U = g.scale[X];
    if (X > 0) {
      D.transform(U, 0, 0, U, g.cx[X] - U * g.cx[0], g.cy[X] - U * g.cy[0]);
      const tt = jt ? Dt(X) : void 0;
      tt ? D.drawImage(tt.c, -ot, -ot, Tt, Tt) : (D.fillStyle = c.sliceG[X], D.fill(n.path)), ct > 0.01 && (D.globalAlpha = ct, D.fillStyle = "#000", D.fill(n.path), D.globalAlpha = 1);
      return;
    }
    u ? D.drawImage(Sn.c, -ot, -ot, Tt, Tt) : (D.fillStyle = c.sliceG[0], D.fill(n.path)), u && D === t && Un > 0.01 && (D.globalAlpha = Un, D.drawImage(gn.c, -ot, -ot, Tt, Tt), D.globalAlpha = 1), ct > 0.01 && (D.globalAlpha = ct, D.drawImage(fn.c, -ot, -ot, Tt, Tt), D.globalAlpha = 1);
  }, Wn = Math.abs(o.facing), Un = Wn >= 0.8 ? 1 : Wn <= 0.45 ? 0 : (Wn - 0.45) / 0.35, no = Hc(i), bn = no.x.length, Mo = i.sd, Qn = i.N, qn = 1.5 / (Math.sqrt(Math.abs(T * B - E * z)) || 1) + 0.4, mo = Tt / Qn, Dn = (X) => (X + ot) / Tt * Qn - 0.5, zo = Math.atan2(-R * et, -R * Y), en = Math.atan2(R * et, R * Y);
  for (let X = A - 1; X >= 1; X--) {
    const nt = -R * g.z[X], ct = g.scale[X];
    if (u) {
      const U = g.cx[X] - ct * g.cx[0] + nt * Y, tt = g.cy[X] - ct * g.cy[0] + nt * et;
      let pt = Number.isFinite(U) && Number.isFinite(tt);
      for (let nn = 0; pt && nn < bn; nn++) {
        const Wt = wa(bn, zo, nn);
        ys(Mo, Qn, Dn(ct * no.x[Wt] + U), Dn(ct * no.y[Wt] + tt)) < qn + ct * (no.d[Wt] + mo) && (pt = !1);
      }
      if (pt) continue;
    }
    Jt(X, nt, u ? 0 : Gt * (1 - Math.exp(-2.4 * (X / A))));
  }
  if (u && ht > 1e-3) {
    const X = V0(J0(i), -Pt, -Ot), nt = 1.3 * g.top * ht;
    pn(0);
    const ct = D.createLinearGradient(-Pt * X, -Ot * X, -Pt * (X + nt), -Ot * (X + nt));
    for (let U = 0; U <= 8; U++) {
      const tt = U / 8;
      ct.addColorStop(tt, `rgba(0,0,0,${(Gt * (1 - Math.exp(-2.4 * tt)) * tt * tt * (3 - 2 * tt)).toFixed(3)})`);
    }
    D.globalCompositeOperation = "source-atop", D.fillStyle = ct, D.fillRect(-ot - 60, -ot - 60, Tt + 120, Tt + 120), D.globalCompositeOperation = "source-over";
  }
  Jt(0, 0, 0);
  const sn = Math.abs(o.facing), vn = sn >= 0.72 ? 1 : sn <= 0.34 ? 0 : ((sn - 0.34) / 0.38) ** 1.5, An = at[0] * at[3] - at[1] * at[2], xo = Sr + 1.5 / (Math.sqrt(Math.abs(An)) || 1);
  for (let X = 1; X < A; X++) {
    const nt = R * g.z[X], ct = g.scale[X];
    if (vn >= 1 && Math.abs(An) > 1e-9) {
      const U = nt * x - 50 * I, tt = -nt * I * k - 50 * $ - 50 * p, pt = L * U + O * tt + W - at[4], nn = S * U + F * tt + C - at[5], Wt = g.cx[X] - ct * g.cx[0], lt = g.cy[X] - ct * g.cy[0];
      let yn = !0;
      for (let tn = 0; yn && tn < bn; tn++) {
        const an = wa(bn, en, tn), In = ct * no.x[an] + Wt, cn = ct * no.y[an] + lt, Tn = T * In + z * cn + pt, ho = E * In + B * cn + nn, _n = (at[3] * Tn - at[2] * ho) / An, Zt = (at[0] * ho - at[1] * Tn) / An;
        ys(Mo, Qn, Dn(_n), Dn(Zt)) < xo + ct * (no.d[an] + mo) && (yn = !1);
      }
      if (yn) continue;
    }
    Jt(X, nt, 0);
  }
  if (vn > 0.01 && (D.save(), D.setTransform(at[0], at[1], at[2], at[3], at[4] - ft, at[5] - Yt), D.globalAlpha = vn, D.drawImage(m, -ot, -ot, Tt, Tt), D.restore()), u && u.mask && P && D !== t) {
    const X = R * Y, nt = R * et, ct = Math.abs(X - c.missAt[0]) > 1.5 * Ys || Math.abs(nt - c.missAt[1]) > 1.5 * Ys, U = ht > 1e-4 ? F1(i, n.path, g, A, P, X, nt, !!o.still || ct) : [0, 0];
    U && (c.miss = U, c.missAt = [X, nt]);
    const [tt, pt] = c.miss, nn = Math.max(tt, pt);
    let Wt = mn(e0 / 2, 2 * e0, nn), lt = mn(e0 / 2, e0, pt);
    const yn = Math.abs(X - c.turnAt[0]) > Ys || Math.abs(nt - c.turnAt[1]) > Ys;
    c.turnAt = [X, nt];
    const tn = !o.still && !yn;
    if (tn && c.fade) {
      const Zt = (ln, Vt) => Math.abs(Vt - ln) < 0.02 ? Vt : ln + (Vt - ln) * 0.2;
      Wt = Zt(c.fade[0], Wt), lt = Zt(c.fade[1], lt);
    }
    c.fade = [Wt, lt];
    const an = c.sprites[4];
    D.imageSmoothingQuality = "low", pn(0), D.transform(P[0], P[1], P[2], P[3], P[4], P[5]);
    const In = (1 - mn(0, h1, Wt)) * (1 - lt), cn = c.lay = tn ? c.lay + Math.max(-La, Math.min(La, In - c.lay)) : In;
    let Tn = null;
    if (cn > 0 && cn < 1) {
      let Zt = c.layTmp;
      if (!Zt || Zt.c.width < _ || Zt.c.height < wt) {
        const ln = Math.ceil(Math.max(_, wt) / 64) * 64;
        let Vt = null;
        typeof document < "u" ? (Vt = document.createElement("canvas"), Vt.width = Vt.height = ln) : Vt = En(ln);
        const Pn = Vt && kn(Vt, !1);
        Zt = c.layTmp = Vt && Pn ? { c: Vt, g: Pn } : null;
      }
      Zt && (Tn = Zt.g, Tn.setTransform(1, 0, 0, 1, 0, 0), Tn.globalAlpha = 1, Tn.globalCompositeOperation = "copy", Tn.drawImage(D.canvas, 0, 0, _, wt, 0, 0, _, wt), Tn.imageSmoothingQuality = "low", Tn.setTransform(D.getTransform()));
    }
    const ho = l1 * Math.min(1, ht / 0.2), _n = (Zt) => {
      if (Fe) {
        let ln = c.haloTmp;
        if (!ln || ln.c.width < _ || ln.c.height < wt) {
          const Vt = Math.ceil(Math.max(_, wt) / 64) * 64;
          let Pn = null;
          typeof document < "u" ? (Pn = document.createElement("canvas"), Pn.width = Pn.height = Vt) : Pn = En(Vt);
          const as = Pn && kn(Pn, !1);
          ln = c.haloTmp = Pn && as ? { c: Pn, g: as } : null;
        }
        if (ln) {
          const Vt = ln.g;
          Vt.setTransform(1, 0, 0, 1, 0, 0), Vt.globalCompositeOperation = "source-over", Vt.globalAlpha = 1, Vt.clearRect(0, 0, _, wt), Vt.imageSmoothingEnabled = !0, Vt.imageSmoothingQuality = "low", Vt.setTransform(Zt.getTransform()), Vt.drawImage(gn.c, -ot, -ot, Tt, Tt), Zt.save(), Zt.setTransform(1, 0, 0, 1, 0, 0), Zt.globalCompositeOperation = "destination-atop", Zt.drawImage(ln.c, 0, 0, _, wt, 0, 0, _, wt), Zt.restore();
        }
      } else
        Zt.globalCompositeOperation = "destination-atop", Zt.drawImage(gn.c, -ot, -ot, Tt, Tt);
      an && ho > 0.01 && (Zt.globalCompositeOperation = "source-atop", Zt.globalAlpha = ho, Zt.drawImage(an.c, -ot, -ot, Tt, Tt), Zt.globalAlpha = 1), Zt.globalCompositeOperation = "source-over";
    };
    if (Tn && _n(Tn), cn >= 1 || !Tn && cn >= 0.5) _n(D);
    else {
      const Zt = Wt < 1 ? m1(u) : null;
      if (Zt) {
        const ln = 1 + Wt * (nn + e0) / 25, Vt = g.cx[0], Pn = g.cy[0];
        D.save(), D.transform(ln, 0, 0, ln, Vt * (1 - ln), Pn * (1 - ln)), D.globalCompositeOperation = "destination-out", D.drawImage(Zt, -ot, -ot, Tt, Tt), D.restore();
      }
      lt < 1 && (D.globalAlpha = 1 - lt, D.globalCompositeOperation = "destination-over", D.drawImage(gn.c, -ot, -ot, Tt, Tt), D.globalAlpha = 1), Tn && (D.setTransform(1, 0, 0, 1, 0, 0), D.globalCompositeOperation = "destination-in", D.globalAlpha = 1 - cn, D.fillStyle = "#000", D.fillRect(0, 0, _, wt), D.globalCompositeOperation = "lighter", D.globalAlpha = cn, D.drawImage(Tn.canvas, 0, 0, _, wt, 0, 0, _, wt), D.globalAlpha = 1);
    }
    D.globalCompositeOperation = "source-over";
  }
  if (D !== t && At) {
    D.globalCompositeOperation = "source-atop", D.imageSmoothingQuality = "low";
    const X = Os(s.base), nt = Math.pow(0.2126 * X[0] + 0.7152 * X[1] + 0.0722 * X[2], 1 / 2.2), ct = A1(At, s.base, e.vivid ?? 0) ?? At.dark, U = C1(At, s.base, e.vivid ?? 0) ?? At.light, tt = o.dev < 160 ? 0 : sn >= 0.88 ? 1 : sn <= 0.55 ? 0 : (sn - 0.55) / 0.33, pt = tt > 0.01 ? w1(At, s.base, e) : null, nn = R * Qc * (n.fur ?? bs).length, Wt = Hs(Hs(Hs(o.ctm, [1, 0, 0, 1, nn * x, -nn * I * k]), [I, $, 0, p, 0, 0]), [G, N, N, dt, bt * Pt - 50 * G - 50 * N, bt * Ot - 50 * N - 50 * dt]), lt = (tn, an, In, cn = tn) => {
      D.setTransform(tn[0], tn[1], tn[2], tn[3], tn[4] - ft, tn[5] - Yt), D.globalAlpha = an, D.drawImage(ct, -ot - vo, -ot - vo, Vn, Vn), cn !== tn && D.setTransform(cn[0], cn[1], cn[2], cn[3], cn[4] - ft, cn[5] - Yt), D.globalAlpha = an * (0.25 + 0.75 * nt), D.drawImage(U, -ot - vo, -ot - vo, Vn, Vn), In && pt && (D.globalAlpha = an * tt, D.drawImage(pt, -ot - vo, -ot - vo, Vn, Vn)), D.globalAlpha = 1;
    }, yn = sn >= 0.62 ? 0 : sn <= 0.36 ? 1 : (0.62 - sn) / 0.26;
    if (yn < 1 && lt(at, 1 - yn, !0, Wt), yn > 0) {
      const tn = o.dev / 100, an = ft + _ / 2, In = Yt + wt / 2;
      lt([tn, 0, 0, tn, an - 50 * tn, In - 50 * tn], yn, !1);
    }
    D.globalCompositeOperation = "source-over", t.save(), t.setTransform(1, 0, 0, 1, 0, 0), t.imageSmoothingEnabled = !1, t.drawImage(D.canvas, 0, 0, _, wt, ft, Yt, _, wt), t.restore();
  }
  t.setTransform(L, S, O, F, W, C);
  const oo = sn >= 0.95 ? 1 : sn <= 0.8 ? 0 : (sn - 0.8) / 0.15;
  if (!u && o.dev >= 256 && e.rim > 0 && e.highlight > 0 && oo > 0.01) {
    t.save(), t.globalCompositeOperation = "source-atop", t.setTransform(at[0], at[1], at[2], at[3], at[4], at[5]);
    const X = oo * Math.min(0.5, 0.3 * e.rim * Math.min(1.4, e.highlight)), nt = t.createLinearGradient(50 + b[0] * 50, 50 + b[1] * 50, 50 - b[0] * 50, 50 - b[1] * 50);
    nt.addColorStop(0, `rgba(235,244,255,${X.toFixed(3)})`), nt.addColorStop(0.45, `rgba(235,244,255,${(0.35 * X).toFixed(3)})`), nt.addColorStop(0.75, "rgba(235,244,255,0)"), t.strokeStyle = nt, t.lineJoin = "round", t.lineWidth = 1.3, t.stroke(n.path), t.restore();
  }
  return !0;
}
function Wr(t, n, o, s, a) {
  return {
    m: t,
    o: n,
    L: o,
    H: s,
    px: a,
    toScreen: (e) => {
      const r = e[0] - n[0], i = e[1] - n[1], l = e[2] - n[2];
      return [t[0] * r + t[1] * i + t[2] * l, t[3] * r + t[4] * i + t[5] * l];
    },
    depth: (e) => t[6] * (e[0] - n[0]) + t[7] * (e[1] - n[1]) + t[8] * (e[2] - n[2]),
    dir: (e) => _o([t[0] * e[0] + t[1] * e[1] + t[2] * e[2], t[3] * e[0] + t[4] * e[1] + t[5] * e[2], t[6] * e[0] + t[7] * e[1] + t[8] * e[2]])
  };
}
const Ws = (t, n) => [t[0] - n[0], t[1] - n[1], t[2] - n[2]], h0 = (t, n) => [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]], lo = (t, n) => t[0] * n[0] + t[1] * n[1] + t[2] * n[2], _o = (t) => {
  const n = Math.hypot(t[0], t[1], t[2]) || 1;
  return [t[0] / n, t[1] / n, t[2] / n];
}, He = Math.PI * 2;
function Xn(t, n, o, s, a = 11) {
  return Math.max(o, Math.min(s, Math.round(n * t.px / a)));
}
function qr(t, n, o, s, a = !0) {
  const e = n + 1, r = e * (o + 1), i = new Float64Array(r * 3);
  let l = 0;
  for (let M = 0, y = 0; M <= o; M++)
    for (let m = 0; m <= n; m++, y++) {
      const A = t(m / n, M / o);
      i[y * 3] = A[0], i[y * 3 + 1] = A[1], i[y * 3 + 2] = A[2], l = Math.max(l, Math.abs(A[0] - i[0]) + Math.abs(A[1] - i[1]) + Math.abs(A[2] - i[2]));
    }
  const h = (M) => [i[M * 3], i[M * 3 + 1], i[M * 3 + 2]], d = new Float64Array(n * o * 3);
  for (let M = 0; M < o; M++)
    for (let y = 0; y < n; y++) {
      const m = M * e + y, A = h(m), g = h(m + 1), I = h(m + e + 1), x = h(m + e);
      let p = h0(Ws(I, A), Ws(x, g));
      const k = [(A[0] + g[0] + I[0] + x[0]) / 4, (A[1] + g[1] + I[1] + x[1]) / 4, (A[2] + g[2] + I[2] + x[2]) / 4], L = typeof s == "function" ? s((y + 0.5) / n, (M + 0.5) / o) : s;
      lo(p, Ws(k, L)) < 0 && (p = [-p[0], -p[1], -p[2]]), p = _o(p);
      const S = (M * n + y) * 3;
      d[S] = p[0], d[S + 1] = p[1], d[S + 2] = p[2];
    }
  const u = 1e-6 + l * 1e-5, c = (M, y) => Math.abs(i[M * 3] - i[y * 3]) + Math.abs(i[M * 3 + 1] - i[y * 3 + 1]) + Math.abs(i[M * 3 + 2] - i[y * 3 + 2]) < u;
  let f = !0;
  for (let M = 0; M <= o && f; M++) f = c(M * e, M * e + n);
  let b = null;
  if (a) {
    const M = new Float64Array(r * 3);
    for (let m = 0; m < o; m++)
      for (let A = 0; A < n; A++) {
        const g = (m * n + A) * 3, I = m * e + A;
        for (const x of [I, I + 1, I + e + 1, I + e])
          M[x * 3] += d[g], M[x * 3 + 1] += d[g + 1], M[x * 3 + 2] += d[g + 2];
      }
    const y = (m) => {
      let A = 0, g = 0, I = 0;
      for (const x of m)
        A += M[x * 3], g += M[x * 3 + 1], I += M[x * 3 + 2];
      for (const x of m)
        M[x * 3] = A, M[x * 3 + 1] = g, M[x * 3 + 2] = I;
    };
    if (f) for (let m = 0; m <= o; m++) y([m * e, m * e + n]);
    for (const m of [0, o]) {
      let A = !0;
      for (let g = 1; g <= n && A; g++) A = c(m * e, m * e + g);
      A && y(Array.from({ length: e }, (g, I) => m * e + I));
    }
    for (let m = 0; m < r; m++) {
      const A = M[m * 3], g = M[m * 3 + 1], I = M[m * 3 + 2], x = Math.hypot(A, g, I) || 1;
      M[m * 3] = A / x, M[m * 3 + 1] = g / x, M[m * 3 + 2] = I / x;
    }
    b = M;
  }
  return { nu: n, nv: o, closed: f, pos: i, fn: d, vn: b };
}
function E1(t, n, o, s, a, e = !1) {
  const i = (l) => t(e ? (l % 1 + 1) % 1 : Math.max(0, Math.min(1, l)));
  return qr(
    (l, h) => {
      const d = t(l), u = _o(Ws(i(l + 1e-3), i(l - 1e-3))), c = lo(n, u), f = _o([n[0] - u[0] * c, n[1] - u[1] * c, n[2] - u[2] * c]), b = h0(u, f), [M, y] = o(l, h * He);
      return [d[0] + f[0] * M + b[0] * y, d[1] + f[1] * M + b[1] * y, d[2] + f[2] * M + b[2] * y];
    },
    s,
    a,
    (l) => t(l)
  );
}
const f0 = (t, n, o = 1) => (s, a) => {
  const e = Math.cos(a), r = Math.sin(a);
  return [t * Math.sign(e) * Math.pow(Math.abs(e), o), n * Math.sign(r) * Math.pow(Math.abs(r), o)];
};
function vr(t, n) {
  const { nu: o, nv: s, pos: a, fn: e, vn: r } = n, i = o + 1, l = i * (s + 1), h = o * s, [d, u, c, f, b, M, y, m, A] = t.m, [g, I, x] = t.o, p = new Float64Array(l), k = new Float64Array(l), L = new Float64Array(l);
  for (let C = 0; C < l; C++) {
    const $ = a[C * 3] - g, T = a[C * 3 + 1] - I, E = a[C * 3 + 2] - x;
    p[C] = d * $ + u * T + c * E, k[C] = f * $ + b * T + M * E, L[C] = y * $ + m * T + A * E;
  }
  const S = (C, $, T) => {
    for (let E = 0; E < T; E++) {
      const z = C[E * 3], B = C[E * 3 + 1], R = C[E * 3 + 2], Y = d * z + u * B + c * R, et = f * z + b * B + M * R, ht = y * z + m * B + A * R, Et = Math.hypot(Y, et, ht) || 1;
      $[E * 3] = Y / Et, $[E * 3 + 1] = et / Et, $[E * 3 + 2] = ht / Et;
    }
  };
  let O = null;
  r && S(r, O = new Float64Array(l * 3), l);
  const F = new Float64Array(h * 3), W = new Float64Array(h);
  S(e, F, h);
  for (let C = 0, $ = 0; C < s; C++)
    for (let T = 0; T < o; T++, $++) {
      const E = C * i + T;
      W[$] = (L[E] + L[E + 1] + L[E + i] + L[E + i + 1]) / 4;
    }
  return { nu: o, nv: s, closed: n.closed, x: p, y: k, d: L, n: O, f: F, cd: W };
}
function Ye(t) {
  let n = 1 / 0, o = 1 / 0, s = -1 / 0, a = -1 / 0;
  for (const e of t)
    for (let r = 0; r < e.x.length; r++)
      e.x[r] < n && (n = e.x[r]), e.x[r] > s && (s = e.x[r]), e.y[r] < o && (o = e.y[r]), e.y[r] > a && (a = e.y[r]);
  return { x0: n, y0: o, x1: s, y1: a, cx: (n + s) / 2, cy: (o + a) / 2, w: s - n, h: a - o };
}
function O1(t, n, o, s) {
  const a = t[s] - t[o], e = n[s] - n[o];
  let r = -1 / 0;
  for (let i = o; i <= s; i++) {
    const l = (t[i] - t[o]) * a + (n[i] - n[o]) * e;
    if (l < r - 1e-9) return !1;
    r = l;
  }
  return !0;
}
const Le = (t) => t < 0 ? 0 : t > 255 ? 255 : Math.round(t), Ms = (t) => `rgb(${Le(t[0])},${Le(t[1])},${Le(t[2])})`;
function wo(t, n, o) {
  const s = [], a = [];
  for (const r of n) {
    const i = r.bias ?? 0, l = r.keep, h = r.cull !== !1;
    for (const d of r.parts) {
      const { nu: u, nv: c, f, cd: b, x: M, y } = d, m = u + 1, A = (g) => (!h || f[g * 3 + 2] > -0.04) && (!l || l(b[g]));
      for (let g = 0; g < c; g++) {
        if (r.flat) {
          for (let p = 0; p < u; p++) {
            const k = g * u + p;
            A(k) && (s.push({ d: b[k] + i, l: r, p: d, j: g, cols: [p, p + 1], cells: [k] }), a.push([M[g * m + p], y[g * m + p]], [M[(g + 1) * m + p + 1], y[(g + 1) * m + p + 1]]));
          }
          continue;
        }
        const I = [];
        let x = null;
        for (let p = 0; p < u; p++)
          A(g * u + p) ? (x || I.push(x = []), x.push(p)) : x = null;
        d.closed && I.length > 1 && I[0][0] === 0 && I[I.length - 1][I[I.length - 1].length - 1] === u - 1 && (I[0] = I.pop().concat(I[0]));
        for (const p of I) {
          const k = p.concat(p[p.length - 1] + 1), L = [], S = [];
          for (let F = 0; F < k.length; F++) {
            const W = g * m + k[F], C = W + m;
            L.push((M[W] + M[C]) / 2), S.push((y[W] + y[C]) / 2), F === 0 || F === k.length - 1 ? a.push([M[W], y[W]], [M[C], y[C]]) : g === 0 ? a.push([M[W], y[W]]) : g === c - 1 && a.push([M[C], y[C]]);
          }
          let O = 0;
          for (; O < k.length - 1; ) {
            let F = O + 1;
            for (; F + 1 < k.length && O1(L, S, O, F + 1); ) F++;
            let W = 0;
            for (let C = O; C < F; C++) W += b[g * u + p[C]];
            s.push({ d: W / (F - O) + i, l: r, p: d, j: g, cols: k.slice(O, F + 1), cells: p.slice(O, F) }), O = F;
          }
        }
      }
    }
  }
  s.sort((r, i) => r.d - i.d);
  const e = 0.5 / o;
  for (const r of s) {
    const { p: i, l, j: h, cols: d, cells: u } = r, { x: c, y: f, n: b, f: M } = i, y = i.nu + 1, m = d.length, A = [], g = [], I = [], x = [], p = h * y + d[0], k = h * y + d[m - 1];
    let L = (c[k] + c[k + y]) / 2 - (c[p] + c[p + y]) / 2, S = (f[k] + f[k + y]) / 2 - (f[p] + f[p + y]) / 2;
    const O = Math.hypot(L, S), F = O > 1e-9 ? L / O : 0, W = O > 1e-9 ? S / O : 0;
    for (let T = 0; T < m; T++) {
      const E = h * y + d[T], z = E + y;
      let B = c[E] - c[z], R = f[E] - f[z];
      const Y = Math.hypot(B, R);
      Y > 1e-9 ? (B /= Y, R /= Y) : B = R = 0;
      const et = T === 0 ? -e : T === m - 1 ? e : 0;
      A.push(c[E] + B * e + F * et), g.push(f[E] + R * e + W * et), I.push(c[z] - B * e + F * et), x.push(f[z] - R * e + W * et);
    }
    const C = (T) => {
      if (b && !l.flat) {
        const B = (h * y + d[T]) * 3, R = B + y * 3;
        return l.shade(_o([b[B] + b[R], b[B + 1] + b[R + 1], b[B + 2] + b[R + 2]]));
      }
      const E = u[Math.max(0, Math.min(u.length - 1, T - 1))] * 3, z = u[Math.min(u.length - 1, T)] * 3;
      return l.shade(l.flat ? [M[z], M[z + 1], M[z + 2]] : _o([M[E] + M[z], M[E + 1] + M[z + 1], M[E + 2] + M[z + 2]]));
    };
    let $;
    if (l.flat || O < 1e-6) $ = Ms(C(0));
    else {
      const T = t.createLinearGradient((c[p] + c[p + y]) / 2, (f[p] + f[p + y]) / 2, (c[k] + c[k + y]) / 2, (f[k] + f[k + y]) / 2);
      let E = null;
      const z = (c[p] + c[p + y]) / 2, B = (f[p] + f[p + y]) / 2;
      for (let R = 0; R < m; R++) {
        const Y = C(R);
        if (E && R < m - 1 && Math.abs(Y[0] - E[0]) + Math.abs(Y[1] - E[1]) + Math.abs(Y[2] - E[2]) < 5) continue;
        const et = h * y + d[R], ht = (((c[et] + c[et + y]) / 2 - z) * L + ((f[et] + f[et + y]) / 2 - B) * S) / (O * O);
        T.addColorStop(ht < 0 ? 0 : ht > 1 ? 1 : ht, Ms(Y)), E = Y;
      }
      $ = T;
    }
    t.fillStyle = $, t.beginPath(), t.moveTo(A[0], g[0]);
    for (let T = 1; T < m; T++) t.lineTo(A[T], g[T]);
    for (let T = m - 1; T >= 0; T--) t.lineTo(I[T], x[T]);
    t.closePath(), t.fill();
  }
  return a;
}
function Bs(t) {
  const n = t.slice().sort((e, r) => e[0] - r[0] || e[1] - r[1]);
  if (n.length < 3) return n;
  const o = (e, r, i) => (r[0] - e[0]) * (i[1] - e[1]) - (r[1] - e[1]) * (i[0] - e[0]), s = [], a = [];
  for (const e of n) {
    for (; s.length >= 2 && o(s[s.length - 2], s[s.length - 1], e) <= 0; ) s.pop();
    s.push(e);
  }
  for (let e = n.length - 1; e >= 0; e--) {
    const r = n[e];
    for (; a.length >= 2 && o(a[a.length - 2], a[a.length - 1], r) <= 0; ) a.pop();
    a.push(r);
  }
  return s.pop(), a.pop(), s.concat(a);
}
const On = (t) => t < 0 ? 0 : t > 1 ? 1 : t, po = (t, n, o) => [t[0] + (n[0] - t[0]) * o, t[1] + (n[1] - t[1]) * o, t[2] + (n[2] - t[2]) * o], es = (t, n) => [t[0] * n, t[1] * n, t[2] * n], As = [255, 255, 255];
function gs(t, n, o = 1) {
  const s = t.L;
  return (a) => {
    const e = lo(a, s), r = Math.pow(On((e + 0.4) / 1.4), 1.35), i = Math.pow(1 - On(a[2]), 2), l = (0.22 + 0.95 * r + 0.22 * i * On(e + 0.6)) * o, h = 26 * r * o;
    return [n[0] * l + h, n[1] * l + h, n[2] * l + h * 1.05];
  };
}
function W1(t, n) {
  const o = t.L, s = po(n, As, 0.3);
  return (a) => {
    const e = lo(a, o), r = On((e + 0.3) / 1.3), i = Math.pow(1 - On(a[2]), 1.6);
    return po(es(n, 0.2 + 0.7 * r), s, 0.6 * i * (0.4 + 0.6 * r));
  };
}
function Ra(t, n) {
  const o = t.L, s = t.H;
  return (a) => {
    const e = On((lo(a, o) + 0.2) / 1.2), r = Math.pow(On(lo(a, s)), 22) * 0.3;
    return po(es(n, 0.36 + 0.7 * e), As, r);
  };
}
function $s(t, n, o = 1) {
  const s = t.L, a = t.H;
  return (e) => {
    const r = On((lo(e, s) + 0.25) / 1.25), i = On(lo(e, a)), l = (Math.pow(i, 16) * 0.2 + Math.pow(i, 80) * 0.6) * o, h = Math.pow(1 - On(e[2]), 3) * 0.14 * o;
    return po(es(n, 0.28 + 0.78 * r), As, On(l + h));
  };
}
function Ha(t, n) {
  const o = t.L, s = t.H, a = es(n, 0.42), e = po(n, As, 0.55);
  return (r) => {
    const i = On((lo(r, o) + 0.35) / 1.35), l = On(lo(r, s)), h = Math.pow(l, 6) * 0.5 + Math.pow(l, 40) * 0.35;
    return po(po(a, n, i), e, On(h));
  };
}
function Xe(t, n, o, s) {
  const a = t.H, e = t.L;
  return (r) => {
    const i = 2 * r[2] * r[2] - 1, h = -(2 * r[2] * r[1]), d = On(0.45 + h * 0.85 + i * 0.1), u = Math.exp(-Math.pow((h + 0.12) / 0.16, 2)) * 0.55, c = On(lo(r, e)), f = po(o, n, On(0.1 + d * 0.72 + c * 0.3)), b = Math.pow(On(lo(r, a)), 70) + u * 0.4;
    return po(f, s, On(b));
  };
}
const Dr = (t) => Xe(t, [255, 200, 88], [86, 50, 8], [255, 247, 220]), q1 = (t) => Xe(t, [232, 236, 242], [58, 62, 72], [255, 255, 255]);
function v1(t, n) {
  const o = t.L, s = t.H, a = es(n, 0.22), e = po(n, As, 0.3);
  return (r) => {
    const i = po(a, e, On(On(r[2]) * 0.75 + lo(r, o) * 0.4));
    return po(i, As, Math.pow(On(lo(r, s)), 24) * 0.95);
  };
}
const D1 = {
  gold: [[0, "#fffbe8"], [0.08, "#ffe7a0"], [0.3, "#eeb546"], [0.62, "#ad7214"], [0.87, "#5a3806"], [1, "#8c5c18"]],
  silver: [[0, "#ffffff"], [0.08, "#f3f5f9"], [0.32, "#c6ccd6"], [0.64, "#7a808c"], [0.88, "#3d4149"], [1, "#6b717c"]],
  pearl: [[0, "#ffffff"], [0.1, "#fdf9f7"], [0.45, "#ebe4e6"], [0.8, "#c6bccb"], [1, "#a89db5"]]
};
function jo(t, n, o, s, a) {
  const e = n.toScreen(o), r = n.H, i = t.createRadialGradient(e[0] + r[0] * s * 0.85, e[1] + r[1] * s * 0.85, 0, e[0], e[1], s);
  if (typeof a == "string") for (const [l, h] of D1[a]) i.addColorStop(l, h);
  else
    i.addColorStop(0, Ms(po(a, As, 0.8))), i.addColorStop(0.1, Ms(po(a, As, 0.3))), i.addColorStop(0.35, Ms(a)), i.addColorStop(0.85, Ms(es(a, 0.5))), i.addColorStop(1, Ms(es(a, 0.62)));
  t.fillStyle = i, t.beginPath(), t.arc(e[0], e[1], s, 0, He), t.fill();
}
function _1(t, n, o, s, a, e, r) {
  const i = h0(s, a), l = (m, A, g) => {
    const I = m * Math.cos(A), x = m * Math.sin(A);
    return [o[0] + I * a[0] + x * i[0] + g * s[0], o[1] + I * a[1] + x * i[1] + g * s[1], o[2] + I * a[2] + x * i[2] + g * s[2]];
  }, h = 8, d = 0.55, u = 0.36 * e, c = [], f = [];
  for (let m = 0; m < h; m++) {
    const A = (m + 0.5) / h * He;
    c.push(l(e, A, 0)), f.push(l(e * d, A, u));
  }
  const b = v1(n, r), M = (m, A) => {
    const g = n.dir(A);
    g[2] <= 0.02 || (t.fillStyle = Ms(b(g)), t.beginPath(), m.forEach((I, x) => {
      const p = n.toScreen(I);
      x ? t.lineTo(p[0], p[1]) : t.moveTo(p[0], p[1]);
    }), t.closePath(), t.fill(), t.strokeStyle = t.fillStyle, t.stroke());
  };
  t.lineWidth = Math.min(0.3, 1 / n.px), t.lineJoin = "round";
  for (let m = 0; m < h; m++) {
    const A = c[m], g = c[(m + 1) % h], I = f[(m + 1) % h], x = f[m];
    let p = h0(Ws(I, A), Ws(x, g));
    lo(p, s) < 0 && (p = [-p[0], -p[1], -p[2]]), M([A, g, I, x], _o(p));
  }
  if (M(f, s), n.dir(s)[2] > 0.1) {
    const m = n.toScreen(l(0, 0, u)), A = n.L;
    t.fillStyle = "rgba(255,255,255,0.3)", t.beginPath();
    const g = n.toScreen(l(e * d * 0.8, Math.atan2(-A[1], -A[0]) + 2.2, u)), I = n.toScreen(l(e * d * 0.9, Math.atan2(-A[1], -A[0]) + Math.PI, u)), x = n.toScreen(l(e * d * 0.8, Math.atan2(-A[1], -A[0]) + Math.PI + 0.94, u));
    t.moveTo(m[0], m[1]), t.lineTo(g[0], g[1]), t.lineTo(I[0], I[1]), t.lineTo(x[0], x[1]), t.closePath(), t.fill();
  }
}
function te(t, n) {
  const o = t.right - t.left;
  for (let s = 0; s < t.widths.length; s++) if (t.widths[s] >= n * o) return s * t.step - ot;
  return t.top;
}
const Ya = /* @__PURE__ */ new WeakMap();
function _r(t) {
  const n = Ya.get(t);
  if (n) return n;
  const o = 128, s = mr(t, o);
  if (!s) return null;
  const a = Tt / o, e = (p) => (p + 0.5) * a - ot, r = (p, k) => s[k * o + p] >= 128, i = Math.floor((42 + ot) / a), l = Math.ceil((58 + ot) / a);
  let h = o, d = -1;
  for (let p = i; p <= l; p++) {
    for (let k = 0; k < o; k++) if (r(p, k)) {
      k < h && (h = k);
      break;
    }
    for (let k = o - 1; k >= 0; k--) if (r(p, k)) {
      k > d && (d = k);
      break;
    }
  }
  const u = (p) => {
    let k = -1, L = -1;
    for (let S = 0; S < o; S++) r(S, p) && (k < 0 && (k = S), L = S);
    return [k, L];
  }, c = Math.min(o - 1, h + Math.round(8 / a)), [f, b] = u(c);
  let M = -1, y = 0, m = 0, A = 0;
  for (let p = Math.round((33 + ot) / a); p <= Math.round((67 + ot) / a); p++) {
    const [k, L] = u(p);
    k >= 0 && L - k > M && (M = L - k, y = k, m = L, A = p);
  }
  const g = new Float32Array(o), I = [];
  for (let p = 0; p < o; p++) {
    const [k, L] = u(p);
    g[p] = k < 0 ? 0 : (L - k + 1) * a, k >= 0 && I.push([e(k) - 0.5 * a, e(p)], [e(L) + 0.5 * a, e(p)]);
  }
  const x = {
    top: e(h) - 0.5 * a,
    topL: e(f),
    topR: e(b),
    mid: e(A),
    left: e(y) - 0.5 * a,
    right: e(m) + 0.5 * a,
    bottom: e(d) + 0.5 * a,
    widths: g,
    step: a,
    hull: Bs(I)
  };
  return Ya.set(t, x), x;
}
function js(t, n, o) {
  const s = Math.cos(n), a = Math.sin(n), e = t[0] * s - t[1] * a, r = t[0] * a + t[1] * s, i = Math.cos(o), l = Math.sin(o);
  return [e, r * i - t[2] * l, r * l + t[2] * i];
}
const ne = (t, n) => [t[0] + n[0], t[1] + n[1], t[2] + n[2]], ns = (t, n, o) => [t[0] + n[0] * o, t[1] + n[1] * o, t[2] + n[2] * o];
function u0(t, n = !0) {
  const o = new Path2D();
  return t.forEach((s, a) => a ? o.lineTo(s[0], s[1]) : o.moveTo(s[0], s[1])), n && o.closePath(), o;
}
function m0(t) {
  let n = 1 / 0, o = 1 / 0, s = -1 / 0, a = -1 / 0;
  for (const [e, r] of t)
    e < n && (n = e), r < o && (o = r), e > s && (s = e), r > a && (a = r);
  return { x0: n, y0: o, x1: s, y1: a, cx: (n + s) / 2, cy: (o + a) / 2, w: s - n, h: a - o };
}
const Vo = (t, n = 0) => {
  let o = t * 2654435761 + n * 40503 | 0;
  return o = Math.imul(o ^ o >>> 15, 2246822507), o = Math.imul(o ^ o >>> 13, 3266489909), ((o ^ o >>> 16) >>> 0) / 4294967296;
};
let $e = null;
function z1() {
  if ($e) return $e;
  const t = 48, n = typeof OffscreenCanvas == "function" ? new OffscreenCanvas(t, t) : typeof document < "u" ? Object.assign(document.createElement("canvas"), { width: t, height: t }) : null, o = n && n.getContext("2d");
  if (!n || !o) return null;
  const s = o.createImageData(t, t);
  for (let a = 0; a < t * t; a++) {
    const e = a % t, r = a / t | 0;
    let i = 0;
    for (let h = -2; h <= 2; h++) i += Vo((e + h + t) % t + (r + h + t) % t * t, 5);
    i /= 5;
    const l = Math.round(255 * (0.82 + 0.36 * i));
    s.data[a * 4] = s.data[a * 4 + 1] = s.data[a * 4 + 2] = Math.min(255, l), s.data[a * 4 + 3] = 255;
  }
  return o.putImageData(s, 0, 0), $e = n, n;
}
const Xa = /* @__PURE__ */ new WeakMap();
function Ke(t, n, o, s = 0.18) {
  var l;
  const a = z1();
  if (!a || n.length < 3) return;
  let e = Xa.get(t);
  e || Xa.set(t, e = /* @__PURE__ */ new Map());
  let r = e.get(s);
  if (r === void 0 && (r = t.createPattern(a, "repeat"), (l = r == null ? void 0 : r.setTransform) == null || l.call(r, new DOMMatrix().scale(s)), e.set(s, r)), !r) return;
  const i = m0(n);
  t.save(), t.clip(u0(n)), t.globalCompositeOperation = "multiply", t.globalAlpha = o, t.fillStyle = r, t.fillRect(i.x0 - 1, i.y0 - 1, i.w + 2, i.h + 2), t.restore();
}
function Ge(t, n, o, s, a, e = 2.4) {
  const r = n.length;
  if (r < 3) return;
  let i = 0;
  const l = [];
  for (let M = 0; M < r; M++) {
    const y = n[M], m = n[(M + 1) % r], A = Math.hypot(m[0] - y[0], m[1] - y[1]);
    l.push(A), i += A;
  }
  const h = Math.min(360, Math.max(24, Math.round(i * Math.min(2.4, e * 0.5)))), d = m0(n), u = new Path2D(), c = new Path2D();
  let f = 0, b = 0;
  for (let M = 0; M < h; M++) {
    const y = (M + Vo(M, s) * 0.8) * (i / h);
    for (; f < r - 1 && b + l[f] < y; ) b += l[f++];
    const m = n[f], A = n[(f + 1) % r], g = l[f] ? (y - b) / l[f] : 0, I = m[0] + (A[0] - m[0]) * g, x = m[1] + (A[1] - m[1]) * g;
    let p = I - d.cx, k = x - d.cy;
    const L = Math.hypot(p, k) || 1;
    p /= L, k /= L;
    const S = (Vo(M, s + 1) - 0.5) * 0.9, O = Math.cos(S), F = Math.sin(S), W = p * O - k * F, C = p * F + k * O, $ = a * (0.35 + Vo(M, s + 2)), T = Vo(M, s + 3) > 0.5 ? u : c;
    T.moveTo(I - W * 0.4, x - C * 0.4), T.lineTo(I + W * $, x + C * $);
  }
  t.save(), t.lineCap = "round", t.lineWidth = 0.4, t.globalAlpha = 0.55, t.strokeStyle = un(o, 0.14), t.stroke(u), t.strokeStyle = un(o, -0.06), t.stroke(c), t.restore();
}
function Zs(t, n, o, s, a, e, r) {
  if (!(a > 0) || !(e > 0)) return;
  t.save(), n && t.clip(n), t.translate(o, s), t.scale(1, e / a);
  const i = t.createRadialGradient(0, 0, 0, 0, 0, a);
  i.addColorStop(0, `rgba(0,0,0,${r})`), i.addColorStop(0.55, `rgba(0,0,0,${r * 0.45})`), i.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = i, t.beginPath(), t.arc(0, 0, a, 0, Math.PI * 2), t.fill(), t.restore();
}
const Ka = 48 * Math.PI / 180;
function zr(t, n) {
  const o = Math.cos(Ka), s = Math.sin(Ka), a = _o([t * o, n * o, s]);
  return { L: a, H: _o([a[0], a[1], a[2] + 1]) };
}
function Be(t) {
  var o;
  const n = (o = t.getTransform) == null ? void 0 : o.call(t);
  return n ? Math.sqrt(Math.abs(n.a * n.d - n.b * n.c)) || 1 : 2;
}
function Rr(t, n) {
  const { L: o, H: s } = zr(t.lx, t.ly);
  return Wr([t.cy, 0, t.sy, t.sy * t.sp, t.cp, -t.cy * t.sp, -t.sy * t.cp, t.sp, t.cy * t.cp], [50, 50, 0], o, s, n);
}
const De = /* @__PURE__ */ new WeakMap();
let d0 = De;
function Hr(t, n) {
  let o = De.get(d0);
  o || De.set(d0, o = /* @__PURE__ */ new Map());
  let s = o.get(t);
  return s || (o.size > 240 && o.clear(), s = n(), o.set(t, s)), s;
}
function Zn(t, n, o, s, a, e, r = !0) {
  return vr(t, Hr(`${n}|${s}x${a}`, () => qr(o, s, a, e, r)));
}
function ms(t, n, o, s, a, e, r, i = !1) {
  return vr(t, Hr(`${n}|${e}x${r}`, () => E1(o, s, a, e, r, i)));
}
const No = (t, n = [40, 40, 44]) => p0(t) ?? n, zt = Math.PI * 2, Yr = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t), ps = (t, n) => Math.sign(t) * Math.pow(Math.abs(t), n);
function R1(t, n, o, s, a, e) {
  return Zn(
    t,
    n,
    (r, i) => {
      const l = r * zt, h = i * Math.PI;
      return [o[0] + s * Math.sin(h) * Math.cos(l), o[1] - s * Math.cos(h), o[2] + s * Math.sin(h) * Math.sin(l)];
    },
    a,
    e,
    o
  );
}
function U0(t, n, o, s, a, e, r, i, l) {
  return Zn(
    t,
    n,
    (h, d) => {
      const u = h * zt, c = d * zt, f = s + e * Math.cos(c);
      return o([f * Math.cos(u), a - e * Math.sin(c), f * r * Math.sin(u)]);
    },
    i,
    l,
    (h) => o([s * Math.cos(h * zt), a, s * r * Math.sin(h * zt)])
  );
}
function Ga(t, n, o) {
  return (s) => {
    const e = _o(Ws(t(Math.min(1, s + 1e-3)), t(Math.max(0, s - 1e-3)))), r = h0(e, n);
    return ns(t(s), r, o(s));
  };
}
function Xr(t, n, o, s, a, e) {
  const r = No(a), i = Xn(n, zt * s, 12, 20), l = wo(t, [{ parts: [R1(n, `ball${e}`, o, s * 0.86, i, Math.max(6, i >> 1))], shade: gs(n, r, 0.92) }], n.px), h = n.toScreen(o), d = m0(l), u = Math.max(d.w, d.h) / 2, c = Math.round(Math.min(340, 50 + u * n.px * 5)), f = new Path2D(), b = new Path2D();
  for (let m = 0; m < c; m++) {
    const A = Vo(m, e) * zt, g = u * (0.25 + 0.7 * Math.sqrt(Vo(m, e + 1))), I = u * (0.25 + 0.35 * Vo(m, e + 2)), x = h[0] + Math.cos(A) * g, p = h[1] + Math.sin(A) * g, k = (Vo(m, e + 3) - 0.5) * 0.6, L = Math.cos(A + k), S = Math.sin(A + k), O = Vo(m, e + 4) > 0.45 ? f : b;
    O.moveTo(x, p), O.quadraticCurveTo(x + Math.cos(A) * I * 0.5, p + Math.sin(A) * I * 0.5, x + L * I, p + S * I);
  }
  t.save(), t.lineCap = "round", t.lineWidth = Math.max(0.3, u * 0.06);
  const M = n.L, y = t.createLinearGradient(h[0] + M[0] * u, h[1] + M[1] * u, h[0] - M[0] * u, h[1] - M[1] * u);
  y.addColorStop(0, un(a, 0.2, -0.03)), y.addColorStop(1, un(a, -0.12, 0.02)), t.strokeStyle = y, t.globalAlpha = 0.85, t.stroke(f), t.strokeStyle = un(a, -0.18, 0.03), t.globalAlpha = 0.6, t.stroke(b), t.restore();
}
function H1(t, n, o, s, a) {
  const e = o.right - o.left, r = 0.46 * e, i = 0.21 * e, l = 0.33 * e, h = 0.05 * e, d = [50 - 0.07 * e, Math.max(o.top + 0.22 * e, te(o, 0.5) + 0.1 * e), 0], u = -0.24, c = -0.2, f = (W) => ne(d, js(W, u, c)), b = Xn(n, zt * r, 32, 56), M = Xn(n, 1.2 * r, 10, 32, 6), m = Zn(n, "beret:dome", (W, C) => {
    const $ = W * zt;
    let T, E;
    const z = 0.74;
    if (C <= z) {
      const R = C / z * (Math.PI / 2);
      T = r * Math.sin(R), E = -(h + i * Math.pow(Math.cos(R), 0.8));
    } else {
      const R = Yr((C - z) / (1 - z));
      T = r + (l - r) * R, E = -h * (1 - R);
    }
    const B = Math.sin(Math.min(1, C / z) * Math.PI * 0.9);
    return T *= 1 + 0.035 * Math.sin($ * 7 + 0.4) * B, f([T * Math.cos($), E, T * 0.93 * Math.sin($)]);
  }, b, M, f([0, -h - i * 0.4, 0])), A = Zn(
    n,
    "beret:under",
    (W, C) => {
      const $ = W * zt, T = l * (1 - C);
      return f([T * Math.cos($), -4e-3 * e * C, T * 0.93 * Math.sin($)]);
    },
    24,
    2,
    f([0, -h - i * 0.4, 0])
  ), g = No(s), I = n.toScreen(f([0, 0.02 * e, 0]));
  Zs(t, a, I[0] + 0.02 * e, I[1] + 0.045 * e, l * 1.25, 0.08 * e, 0.4);
  const x = U0(n, "beret:binding", f, l, -5e-3 * e, 0.022 * e, 0.93, Xn(n, zt * l, 24, 48), 5), p = No(un(s, -0.06)), k = wo(
    t,
    [
      { parts: [A], shade: gs(n, g, 0.7) },
      { parts: [x], shade: $s(n, p, 0.45) },
      { parts: [m], shade: gs(n, g) }
    ],
    n.px
  ), L = Bs(k);
  Ke(t, L, 0.5, 0.14), Ge(t, L, s, 11, 0.4, n.px);
  const S = 0.02 * e, O = -h - i + 6e-3 * e, F = ms(
    n,
    "beret:stalk",
    (W) => f([S + 0.014 * e * W * W, O - 0.045 * e * W, 0]),
    [0, 0, 1],
    (W, C) => [0.016 * e * (1 - 0.25 * W) * Math.cos(C), 0.016 * e * (1 - 0.25 * W) * Math.sin(C)],
    8,
    3
  );
  wo(t, [{ parts: [F], shade: gs(n, g, 0.95) }], n.px), jo(t, n, f([S + 0.014 * e, O - 0.047 * e, 0]), 0.019 * e, es(g, 1.15));
}
function Y1(t, n, o, s, a) {
  const e = o.right - o.left, i = 0.53 * Math.max(0.5 * e, o.topR - o.topL) + 0.08 * e, l = 0.32 * e, h = 0.1 * e, d = i * 1.05, u = [50, te(o, 0.72) + 0.06 * e, 0], c = 0, f = -0.14, b = ($) => ne(u, js($, c, f)), M = ($, T) => {
    const E = $ * zt, z = T * (Math.PI / 2), B = i * Math.sin(z) * (1 - 0.03 * (1 - T)), R = -(h + l * Math.cos(z));
    return b([B * Math.cos(E), R, B * 0.92 * Math.sin(E)]);
  }, y = b([0, -h - l * 0.4, 0]), m = Zn(n, "beanie:dome", M, Xn(n, zt * i, 28, 48), Xn(n, 1.3 * l, 9, 24, 6), y), A = ($, T) => {
    const E = $ * zt, z = 2 * T - 1, B = d * (1 - 0.07 * z * z * z * z) * 1.01;
    return b([B * Math.cos(E), -h * (1 - T), B * 0.92 * Math.sin(E)]);
  }, g = Zn(n, "beanie:cuff", A, Xn(n, zt * d, 28, 56), 4, b([0, -h / 2, 0])), I = No(s), x = No(un(s, 0.03)), p = Ye([g]);
  Zs(t, a, p.cx, p.y1 - 0.01 * e, p.w * 0.5, 0.06 * e, 0.34);
  const k = wo(t, [{ parts: [m], shade: gs(n, I, 0.96) }], n.px), L = 40, S = 11;
  if (i * zt / L * n.px >= 2.2) {
    const $ = Zn(n, "beanie:stitch", M, L, S, y, !1), T = new Path2D(), E = new Path2D(), z = L + 1;
    for (let R = 0; R < L * S; R++) {
      if ($.f[R * 3 + 2] < 0.12) continue;
      const Y = Math.floor(R / L) * z + R % L, et = [$.x[Y], $.y[Y]], ht = [$.x[Y + 1], $.y[Y + 1]], Et = [$.x[Y + z + 1], $.y[Y + z + 1]], Pt = [$.x[Y + z], $.y[Y + z]], Ot = (Gt, P) => {
        const q = [et[0] + (ht[0] - et[0]) * Gt, et[1] + (ht[1] - et[1]) * Gt], V = [Pt[0] + (Et[0] - Pt[0]) * Gt, Pt[1] + (Et[1] - Pt[1]) * Gt];
        return [q[0] + (V[0] - q[0]) * P, q[1] + (V[1] - q[1]) * P];
      };
      for (const [Gt, P] of [[T, 0], [E, -0.06]]) {
        const q = Ot(0.14 + P, 0.12), V = Ot(0.5 + P, 0.88), bt = Ot(0.86 + P, 0.12);
        Gt.moveTo(q[0], q[1]), Gt.lineTo(V[0], V[1]), Gt.lineTo(bt[0], bt[1]);
      }
    }
    const B = i * zt / L;
    t.save(), t.clip(u0(Bs(k))), t.lineCap = "round", t.lineJoin = "round", t.lineWidth = Math.max(0.35, B * 0.2), t.strokeStyle = un(s, -0.22, 0.03), t.globalAlpha = 0.5, t.stroke(T), t.lineWidth = Math.max(0.3, B * 0.12), t.strokeStyle = un(s, 0.2, -0.03), t.globalAlpha = 0.35, t.stroke(E), t.restore();
  }
  const F = wo(t, [{ parts: [g], shade: gs(n, x, 0.98) }], n.px), W = zt * d / 30;
  if (W * n.px >= 3) {
    const $ = new Path2D(), T = new Path2D();
    for (let E = 0; E < 60; E++) {
      const z = E / 60, B = z * zt;
      if (n.dir(js([Math.cos(B), 0, 0.92 * Math.sin(B)], c, f))[2] < 0.08) continue;
      const R = n.toScreen(A(z, 0.1)), Y = n.toScreen(A(z, 0.9)), et = E % 2 ? $ : T;
      et.moveTo(R[0], R[1]), et.lineTo(Y[0], Y[1]);
    }
    t.save(), t.lineCap = "round", t.lineWidth = W * 0.34, t.strokeStyle = un(s, -0.2, 0.03), t.globalAlpha = 0.45, t.stroke($), t.lineWidth = W * 0.22, t.strokeStyle = un(s, 0.16, -0.02), t.globalAlpha = 0.4, t.stroke(T), t.restore();
  }
  const C = Bs(k.concat(F));
  Ge(t, C, s, 23, 0.35, n.px), Xr(t, n, b([0, -h - l - 0.055 * e, 0]), 0.085 * e, un(s, 0.06), 31);
}
function X1(t, n, o, s, a) {
  const e = o.right - o.left, r = [50 + 0.06 * e, te(o, 0.3) + 0.04 * e, 0], i = 0.18 * e, l = Math.max(0.3 * e, Math.min(0.46 * e, r[1] + 31 - 0.1 * e)), h = 0.18, d = -0.12, u = (S) => ne(r, js(S, h, d)), c = (S, O, F = 1) => {
    const W = S * zt, C = i * (1 - O) * (1 + 0.04 * Math.sin(O * Math.PI)) * F;
    return u([C * Math.cos(W), -l * O, C * Math.sin(W)]);
  }, f = (S, O) => u([0, -l * Math.min(0.97, O), 0]), b = Xn(n, zt * i, 20, 40), M = Xn(n, l, 10, 24, 6), y = Zn(n, "party:cone", (S, O) => c(S, O), b, M, f), m = No(s), A = [252, 246, 234], g = Ye([y]);
  Zs(t, a, g.cx, g.y1, i * 1.15, 0.04 * e, 0.3);
  const I = U0(n, "party:trim", u, i * 1.02, 4e-3 * e, 0.016 * e, 1, Xn(n, zt * i, 20, 40), 5), x = [], p = 6, k = 3.2;
  for (let S = 0; S < p; S += 1)
    x.push(Zn(n, `party:stripe${S}`, (O, F) => c((S + 0.5 * F - k * O * 0.97) / p, O * 0.97, 1.004), M + 3, 1, f));
  const L = wo(
    t,
    [
      { parts: [y], shade: Ra(n, A) },
      { parts: [I], shade: Dr(n) }
    ],
    n.px
  );
  wo(t, [{ parts: x, shade: Ra(n, m) }], n.px), Ke(t, Bs(L), 0.18, 0.1), Xr(t, n, u([0, -l - 0.035 * e, 0]), 0.06 * e, "#f4efe6", 37);
}
function K1(t, n, o, s) {
  const a = o.right - o.left, r = 0.44 * Math.max(0.45 * a, o.topR - o.topL) + 0.07 * a, i = 0.11 * a, l = 0.15 * a, h = 0.9, d = [50, te(o, 0.42) + 0.05 * a, 0], u = 0.05, c = -0.22, f = (G) => ne(d, js(G, u, c)), b = (G) => _o(js(G, u, c)), M = (G, N, dt) => f([N * Math.cos(G), dt, N * h * Math.sin(G)]), y = (G) => f([0, G, 0]), m = Xn(n, zt * r, 32, 64), A = Zn(n, "crown:band", (G, N) => M(G * zt, r * (1 - 0.018 * Math.sin(N * Math.PI)), -i * (1 - N)), m, 2, (G, N) => y(-i * (1 - N))), g = 0.017 * a, I = U0(n, "crown:rimTop", f, r + 4e-3 * a, -i, g, h, m, 5), x = U0(n, "crown:rimBot", f, r + 4e-3 * a, 0, g * 1.15, h, m, 5), p = -i * 0.55, k = Math.max(0.12 * a, d[1] - o.top + 0.04 * a + p), L = Math.PI / 2, S = Zn(
    n,
    "crown:cap",
    (G, N) => {
      const dt = G * zt, at = N * (Math.PI / 2), At = 0.08 * Math.sin(2 * at) * (0.55 + 0.45 * Math.cos(5 * (dt - L - Math.PI / 5)));
      return M(dt, r * (0.9 * Math.sin(at) + At), p - k * Math.cos(at));
    },
    Xn(n, zt * r, 24, 48),
    Xn(n, 1.4 * k, 8, 20, 6),
    y(p - k * 0.4)
  ), O = [], F = [], W = [], C = [], $ = (G, N, dt, at, At, D, ft) => {
    ft.push(
      Zn(
        n,
        G,
        (Yt, _) => {
          const wt = Yt * 2 - 1, pn = N + wt * dt * Math.pow(1 - _, 1.3), gn = r + 4e-3 * a + At * (1 - Math.abs(wt)) * (1 - 0.5 * _) + D * _ * _;
          return M(pn, gn, -i - at * _);
        },
        2,
        Xn(n, at, 3, 5),
        (Yt, _) => M(N, r * 0.5, -i - at * _),
        !1
      )
    );
  };
  for (let G = 0; G < 5; G++) {
    const N = L + G / 5 * zt;
    $(`crown:point${G}`, N, zt / 5 * 0.34, l, 0.05 * a, 0.03 * a, O), W.push(M(N, r + 4e-3 * a + 0.03 * a + 0.02 * a, -i - l - 0.018 * a));
    const dt = N + Math.PI / 5;
    $(`crown:bud${G}`, dt, zt / 5 * 0.12, l * 0.36, 0.02 * a, 0.01 * a, F), C.push(M(dt, r + 4e-3 * a + 0.012 * a, -i - l * 0.36 - 0.012 * a));
  }
  const T = Ye([A]);
  Zs(t, s, T.cx, T.y1, T.w * 0.5, 0.045 * a, 0.34);
  const E = n.depth(y(p)), z = Dr(n), B = Xe(n, [255, 196, 80], [92, 54, 10], [255, 222, 150]), R = (G) => B(G[2] < 0 ? [-G[0], -G[1], -G[2]] : G), Y = 0.024 * a, et = 0.019 * a;
  for (const G of W) n.depth(G) < E && jo(t, n, G, Y, "pearl");
  for (const G of C) n.depth(G) < E && jo(t, n, G, et, "gold");
  wo(
    t,
    [
      { parts: [S], shade: W1(n, [150, 22, 44]) },
      { parts: [A], shade: z, bias: 0.01 * a },
      { parts: [I], shade: z, bias: 0.012 * a },
      { parts: [x], shade: z, bias: 0.012 * a },
      { parts: O, shade: R, cull: !1, flat: !0 },
      { parts: F, shade: R, cull: !1, flat: !0 }
    ],
    n.px
  );
  const ht = [[208, 20, 60], [30, 150, 92], [36, 90, 220], [36, 90, 220], [30, 150, 92]];
  for (let G = 0; G < 5; G++)
    for (const [N, dt] of [[L + G / 5 * zt, "stone"], [L + G / 5 * zt + Math.PI / 5, "stud"]]) {
      const at = b([Math.cos(N), 0, h * Math.sin(N)]);
      if (n.dir(at)[2] < 0.12) continue;
      const At = M(N, r + 0.01 * a, -i * 0.5);
      if (dt === "stud") {
        jo(t, n, At, 0.013 * a, "gold");
        continue;
      }
      const D = (G === 0 ? 0.034 : 0.027) * a;
      jo(t, n, At, D * 1.3, "gold");
      const ft = b([-Math.sin(N), 0, h * Math.cos(N)]);
      _1(t, n, ns(At, at, 6e-3 * a), at, ft, D, ht[G]);
    }
  for (const G of W) n.depth(G) >= E && jo(t, n, G, Y, "pearl");
  for (const G of C) n.depth(G) >= E && jo(t, n, G, et, "gold");
  const Et = 0.034 * a, Pt = y(p - k - Et * 0.75), Ot = b([0, -1, 0]), Gt = (G, N, dt) => ms(n, G, (at) => [N[0] + (dt[0] - N[0]) * at, N[1] + (dt[1] - N[1]) * at, N[2] + (dt[2] - N[2]) * at], b([0, 0, 1]), f0(9e-3 * a, 9e-3 * a, 0.5), 2, 6), P = ns(Pt, Ot, Et * 0.8), q = ns(Pt, Ot, Et * 0.8 + 0.075 * a), V = ns(Pt, Ot, Et * 0.8 + 0.05 * a), bt = b([1, 0, 0]);
  jo(t, n, Pt, Et, "gold"), wo(
    t,
    [
      { parts: [Gt("crown:barV", P, q)], shade: z },
      { parts: [Gt("crown:barH", ns(V, bt, -0.026 * a), ns(V, bt, 0.026 * a))], shade: z }
    ],
    n.px
  );
}
function G1(t, n, o) {
  const s = n.right - n.left, a = 0.15 * s, e = 1.1, r = 0.05 * s, i = 0.068 * s, l = n.mid - 0.07 * s, h = 0.5, d = No(o), u = No(un(o, -0.12)), c = No(un(o, 0.08)), f = Xn(t, zt * a, 20, 40), b = [], M = [], y = [], m = [], A = q1(t);
  for (const P of [-1, 1]) {
    const q = [P * Math.cos(h), 0, Math.sin(h)], V = [0, 1, 0], bt = [-Math.sin(h), 0, P * Math.cos(h)], G = [(P < 0 ? n.left : n.right) - P * 0.02 * s, l, 0.01 * s], N = (jt, Qt, Dt) => {
      const Jt = Math.cos(Dt) * e * Qt, Wn = Math.sin(Dt) * Qt;
      return [G[0] + q[0] * jt + V[0] * Jt + bt[0] * Wn, G[1] + q[1] * jt + V[1] * Jt + bt[1] * Wn, G[2] + q[2] * jt + V[2] * Jt + bt[2] * Wn];
    }, dt = (jt) => ns(G, q, jt);
    m.push({ c: G, ry: a * e });
    const at = a * 0.9 - r * 0.5, At = f >= 48 ? 1 : 0, D = Zn(
      t,
      `phones:cushion${P}`,
      (jt, Qt) => {
        const Dt = jt * zt, Jt = Qt * Math.PI, Wn = 1 + 6e-3 * At * Math.sin(Dt * 24) * Math.sin(Jt);
        return N(r * 0.5 * (1 - Math.cos(Jt)), (at + r * 0.62 * Math.sin(Jt)) * Wn, Dt);
      },
      f,
      5,
      (jt, Qt) => dt(r * 0.5 * (1 - Math.cos(Qt * Math.PI)))
    ), ft = Zn(
      t,
      `phones:shell${P}`,
      (jt, Qt) => {
        const Dt = Qt * (Math.PI / 2);
        return N(r + i * Math.pow(Math.sin(Dt), 0.55), a * (0.7 + 0.3 * Math.pow(Math.cos(Dt), 0.55)), jt * zt);
      },
      f,
      5,
      dt(r + i * 0.5)
    ), Yt = 0.66 * a, _ = 0.017 * s, wt = Zn(
      t,
      `phones:ring${P}`,
      (jt, Qt) => N(r + i + _ * 0.45 * Math.sin(Qt * zt), Yt + _ * Math.cos(Qt * zt), jt * zt),
      f,
      5,
      (jt) => N(r + i, Yt, jt * zt)
    ), pn = Yt - _ * 0.5, gn = Zn(t, `phones:plate${P}`, (jt, Qt) => N(r + i + 0.013 * s * (1 - Qt * Qt), pn * Qt, jt * zt), f, 3, dt(r + i - 0.02 * s)), fn = r + i * 0.45, Sn = a * 1.04 + 0.022 * s, rn = (jt) => {
      const Qt = jt * Math.PI, Dt = -Math.sin(Qt) * e * Sn, Jt = Math.cos(Qt) * Sn;
      return [G[0] + q[0] * fn + V[0] * Dt + bt[0] * Jt, G[1] + q[1] * fn + V[1] * Dt + bt[1] * Jt, G[2] + q[2] * fn + V[2] * Dt + bt[2] * Jt];
    }, Mn = ms(t, `phones:yoke${P}`, rn, q, f0(0.013 * s, 8e-3 * s, 0.6), Xn(t, Math.PI * Sn, 12, 24), 6);
    M.push(rn(0), rn(1)), y.push(rn(0.5)), b.push(
      { parts: [D], shade: $s(t, u, 0.35) },
      { parts: [ft], shade: $s(t, d, 0.8) },
      { parts: [wt], shade: A, bias: 0.02 * s },
      { parts: [gn], shade: $s(t, c, 1.3), bias: 0.01 * s },
      { parts: [Mn], shade: A }
    );
  }
  const [g, I] = y, x = (g[2] + I[2]) / 2, p = (g[0] + I[0]) / 2, k = (I[0] - g[0]) / 2, L = (g[1] + I[1]) / 2, S = (P) => 5e-3 * s + 0.022 * s * Math.pow(Math.sin(Math.PI * P), 0.35), O = 2 / 2.2, F = (P) => {
    let q = 1 / 0;
    const V = n.hull;
    for (let bt = 0; bt < V.length; bt++) {
      const G = V[bt], N = V[(bt + 1) % V.length];
      G[0] === N[0] || P < Math.min(G[0], N[0]) || P > Math.max(G[0], N[0]) || (q = Math.min(q, G[1] + (N[1] - G[1]) * (P - G[0]) / (N[0] - G[0])));
    }
    return q;
  };
  let W = L - n.top;
  for (let P = 1; P < 64; P++) {
    const q = Math.PI * (1 - P / 64), V = Math.pow(Math.abs(Math.sin(q)), O), bt = F(p + k * ps(Math.cos(q), O));
    V > 0.05 && Number.isFinite(bt) && (W = Math.max(W, (L - bt + 2 * S(P / 64) + 6e-3 * s) / V));
  }
  const C = (P) => {
    const q = Math.PI * (1 - P);
    return [p + k * ps(Math.cos(q), O), L - W * Math.pow(Math.abs(Math.sin(q)), O), x];
  }, $ = (P, q) => (V) => C(P + (q - P) * V), T = [0, 0, 1], E = k * 2 + W * 2, z = Xn(t, E, 24, 48), B = 0.09, R = 0.016 * s, Y = Ga($(B, 1 - B), T, () => R), et = (P) => Yr(Math.min(P, 1 - P) / 0.07), ht = ms(
    t,
    "phones:bandShell",
    Y,
    T,
    (P, q) => {
      const V = et(P);
      return [(0.024 + 0.016 * V) * s * ps(Math.cos(q), 0.4), (8e-3 + 8e-3 * V) * s * ps(Math.sin(q), 0.4)];
    },
    z,
    6
  ), Et = Ga($(B + 0.02, 1 - B - 0.02), T, (P) => -S(B + 0.02 + (1 - 2 * B - 0.04) * P)), Pt = ms(
    t,
    "phones:bandPad",
    Et,
    T,
    (P, q) => [0.034 * s * ps(Math.cos(q), 0.5), S(B + 0.02 + (1 - 2 * B - 0.04) * P) * ps(Math.sin(q), 0.7)],
    z,
    6
  ), Ot = [$(0, B + 0.03), $(1 - B - 0.03, 1)].map((P, q) => ms(t, `phones:slider${q}`, P, T, f0(0.022 * s, 6e-3 * s, 0.4), 4, 6));
  b.push(
    { parts: [ht], shade: $s(t, d, 0.9) },
    { parts: [Pt], shade: $s(t, u, 0.3) },
    { parts: Ot, shade: A }
  );
  const Gt = [];
  for (let P = 0; P <= 48; P++) Gt.push(ns(Et(0.04 + 0.92 * P / 48), T, 0.034 * s + 1e-3 * s));
  return { layers: b, pivots: M, pivotR: 0.017 * s, stitch: Gt, seats: m };
}
let a0 = null;
function Kr(t, n, o, s, a, e) {
  const r = `${n.m.join()}|${n.px}|${n.L.join()}|${s}`;
  (!a0 || a0.m !== o || a0.key !== r) && (a0 = { m: o, key: r, ph: G1(n, o, s) });
  const i = a0.ph, l = o.right - o.left, h = (d) => a === "front" ? d >= 0 : d < 0;
  if (a === "front")
    for (const d of i.seats) {
      if (n.depth(d.c) < 0) continue;
      const u = n.toScreen(d.c);
      Zs(t, e, u[0], u[1] + 0.01 * l, 0.06 * l, d.ry * 1.05, 0.26);
    }
  wo(
    t,
    i.layers.map((d) => ({ ...d, keep: h })),
    n.px
  );
  for (const d of i.pivots) h(n.depth(d)) && jo(t, n, d, i.pivotR, "silver");
  if (a === "front" && l * n.px > 120 && n.dir([0, 0, 1])[2] > 0.3) {
    const d = i.stitch.map((u) => n.toScreen(u));
    t.save(), t.setLineDash([0.022 * l, 0.014 * l]), t.lineCap = "round", t.lineWidth = 45e-4 * l, t.strokeStyle = un(s, 0.12), t.globalAlpha = 0.55, t.stroke(u0(d, !1)), t.restore();
  }
}
function B1(t, n, o, s, a, e, r, i, l = !1) {
  if (o.facing < 0.05) return;
  const h = s.right - s.left, d = i.y + 22 * i.scale, u = Math.max(d, s.bottom - 0.15 * h), c = Math.max(0, s.bottom - 3 - u), f = Math.min(h, 100) * Math.max(0.5, Math.min(1, c / 15)), b = e(50, u), M = (F, W, C) => [50 + F * f, u + W * f, b + C * f], y = No(a), m = [M(-0.36, -0.18, 0), M(0.36, 0.18, 0), M(-0.36, 0.18, 0), M(0.36, -0.18, 0)].map((F) => n.toScreen(F)), A = m0(m), g = n.toScreen(M(0.01, 0.08, 0));
  Zs(t, r, g[0], g[1], A.w * 0.52, A.h * 0.5, 0.3);
  const I = Xn(n, 0.32 * f, 8, 16), x = Xn(n, 0.3 * f, 8, 16, 6), p = `${b.toFixed(2)},${u.toFixed(2)},${f.toFixed(2)}`, k = !!l, L = k ? gs(n, y) : Ha(n, y), S = [];
  for (const F of [-1, 1]) {
    const W = (C, $) => {
      const T = 0.058 + 0.3 * C - 0.035 * Math.pow(C, 4) * Math.sin(Math.PI * $), z = -(0.05 + 0.12 * Math.pow(C, 0.8)) * Math.cos(Math.PI * $) + 0.012 * C * C, B = 0.018 + 0.058 * Math.sin(Math.PI * (0.12 + 0.88 * C)), R = 0.016 * Math.sin(3 * Math.PI * $) * Math.pow(1 - C, 1.3);
      return M(F * T, z, (B + R) * Math.sin(Math.PI * $) + 4e-3);
    };
    S.push({ parts: [Zn(n, `bow:wing${F}@${p}`, W, I, x, (C) => M(F * (0.058 + 0.3 * C), 0, -0.03))], shade: L }), S.push({
      parts: [Zn(
        n,
        `bow:end${F}@${p}`,
        (C, $) => {
          const T = W(1, $);
          return [T[0], T[1], T[2] - (T[2] - b) * C];
        },
        1,
        x,
        M(F * 0.2, 0, -0.03)
      )],
      shade: L
    });
  }
  const O = Zn(
    n,
    `bow:knot@${p}`,
    (F, W) => {
      const C = 0.068 * (2 * F - 1) * (1 - 0.12 * Math.sin(Math.PI * W)), $ = 0.075 * (2 * W - 1), T = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * F - 1), 3)), 0.5), E = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * W - 1), 5)), 0.4);
      return M(C, $, 0.012 + 0.075 * T * E);
    },
    6,
    6,
    M(0, 0, -0.02)
  );
  if (S.push({ parts: [O], shade: k ? gs(n, y, 0.9) : Ha(n, es(y, 0.9)) }), !k) {
    wo(t, S, n.px);
    return;
  }
  for (let F = 0; F < S.length; F += 2) {
    const W = S.slice(F, F + 2), C = Bs(wo(t, W, n.px));
    Ke(t, C, 0.5, 0.1), Ge(t, C, a, 41 + F, 0.3, n.px);
  }
}
const Ba = {
  round: { rx: 10.8, ry: 10.8, n: 2, tr: 1.15, td: 1.2 },
  square: { rx: 12, ry: 9.6, n: 4.2, tr: 1.45, td: 1.4 },
  shades: { rx: 12.6, ry: 10, n: 3.4, tr: 1.6, td: 1.5 }
};
function ja(t, n, o, s, a, e = { yaw: 0, pitch: 0 }) {
  if (n === "none") return;
  d0 = Ba;
  const r = Ba[n], i = Math.cos(e.yaw), l = Math.sin(e.yaw), h = Math.cos(e.pitch), d = Math.sin(e.pitch), { L: u, H: c } = zr(s.lx, s.ly), f = Wr([i, 0, l, d * l, h, -d * i, -h * l, d, h * i], [0, 0, 0], u, c, Be(t)), b = Math.max(o[0].fz, o[1].fz) + 3.2, M = (C) => b - 45e-4 * C * C, y = 2 / r.n, m = (C, $) => (T) => {
    const E = T * zt, z = C.ox + (r.rx + $) * ps(Math.cos(E), y), B = C.oy + (r.ry + $) * ps(Math.sin(E), y);
    return [z, B, M(z)];
  }, A = (C, $, T = 48) => {
    const E = m(C, $), z = [];
    for (let B = 0; B < T; B++) z.push(f.toScreen(E(B / T)));
    return z;
  }, g = o.map((C) => Math.max(0, Math.min(1, (C.z - 0.18) * 3.2)));
  if (a === "shadow") {
    for (let C = 0; C < 2; C++)
      g[C] <= 0 || (t.save(), t.globalAlpha = 0.22 * g[C], t.translate(-s.lx * 1.6, -s.ly * 1.6 + 0.8), t.lineWidth = r.tr * 2 + 0.6, t.lineJoin = "round", t.strokeStyle = "#000", t.stroke(u0(A(o[C], 0))), t.restore());
    return;
  }
  const x = $s(f, [22, 22, 26], 1.1);
  for (let C = 0; C < 2; C++) {
    if (g[C] <= 0) continue;
    const $ = u0(A(o[C], -r.tr * 0.5)), T = m0(A(o[C], 0, 16));
    if (t.save(), t.globalAlpha = g[C], n === "shades") {
      const Y = t.createLinearGradient(T.cx, T.y0, T.cx, T.y1);
      Y.addColorStop(0, "rgba(58,60,78,0.97)"), Y.addColorStop(0.55, "rgba(18,18,26,0.98)"), Y.addColorStop(1, "rgba(30,26,44,0.98)"), t.fillStyle = Y;
    } else {
      const Y = t.createLinearGradient(T.cx, T.y0, T.cx, T.y1);
      Y.addColorStop(0, "rgba(236,244,255,0.26)"), Y.addColorStop(0.45, "rgba(214,230,255,0.08)"), Y.addColorStop(1, "rgba(214,230,255,0.14)"), t.fillStyle = Y;
    }
    t.fill($), t.clip($);
    const E = T.w, z = T.h, B = (Y, et, ht) => {
      t.globalAlpha = g[C] * ht, t.fillStyle = "#fff", t.beginPath(), t.moveTo(T.x0 + E * Y, T.y1 + z * 0.1), t.lineTo(T.x0 + E * (Y + 0.55), T.y0 - z * 0.1), t.lineTo(T.x0 + E * (Y + 0.55 + et), T.y0 - z * 0.1), t.lineTo(T.x0 + E * (Y + et), T.y1 + z * 0.1), t.closePath(), t.fill();
    }, R = n === "shades" ? 1.4 : 1;
    B(-0.28, 0.26, 0.16 * R), B(0.06, 0.07, 0.3 * R), t.restore();
  }
  const p = Xn(f, zt * r.rx * 1.1, 28, 56, 8), k = (C) => ms(f, `rim:${n}:${C.ox},${C.oy},${C.fz.toFixed(2)}`, m(C, 0), [0, 0, 1], f0(r.td, r.tr, 0.55), p, 6, !0), [L, S] = o, O = (C) => {
    const $ = n === "round", T = [L.ox + r.rx * ($ ? 0.9 : 0.98), L.oy - r.ry * ($ ? 0.32 : 0.42), 0], E = [S.ox - r.rx * ($ ? 0.9 : 0.98), S.oy - r.ry * ($ ? 0.32 : 0.42), 0], z = [0, (L.oy + S.oy) / 2 - r.ry * ($ ? 0.8 : 0.6), 0], B = 1 - C, R = B * B * T[0] + 2 * B * C * z[0] + C * C * E[0], Y = B * B * T[1] + 2 * B * C * z[1] + C * C * E[1];
    return [R, Y, M(R) + 0.3];
  }, F = ms(f, `bridge:${n}:${L.ox},${L.oy},${S.ox},${b.toFixed(2)}`, O, [0, 0, 1], f0(r.td * 0.8, r.tr * 0.75, 0.7), 8, 6), W = [
    { part: k(L), a: g[0], d: f.depth([L.ox, L.oy, b]) },
    { part: k(S), a: g[1], d: f.depth([S.ox, S.oy, b]) },
    { part: F, a: Math.min(g[0], g[1]), d: f.depth([0, L.oy, b]) }
  ].sort((C, $) => C.d - $.d);
  for (const C of W)
    C.a <= 0 || (t.save(), t.globalAlpha = C.a, wo(t, [{ parts: [C.part], shade: x }], f.px), t.restore());
  for (const [C, $, T] of [[L, -1, g[0]], [S, 1, g[1]]]) {
    if (T <= 0) continue;
    t.save(), t.globalAlpha = T;
    const E = C.ox + $ * r.rx * 0.93;
    jo(t, f, [E, C.oy - r.ry * 0.5, M(E) + r.td], 0.75, "silver"), t.restore();
  }
}
function j1(t, n, o, s) {
  if (!s.headphones) return;
  const a = _r(n);
  a && (d0 = a, Kr(t, Rr(o, Be(t)), a, s.color, "behind", null));
}
function Z1(t, n, o, s, a, e, r) {
  const i = _r(n);
  if (!i) return;
  d0 = i;
  const l = Rr(o, Be(t));
  switch (s.bowTie && B1(t, l, o, i, s.color, e, a, r, s.fabric), s.headphones && Kr(t, l, i, s.color, "front", a), s.hat) {
    case "beret":
      H1(t, l, i, s.color, a);
      break;
    case "beanie":
      Y1(t, l, i, s.color, a);
      break;
    case "party":
      X1(t, l, i, s.color, a);
      break;
    case "crown":
      K1(t, l, i, a);
      break;
  }
}
const ts = 1.5, X0 = 0.1, Es = 17, V1 = 15, N1 = 0.9, Za = (t, n) => n + (1 - n) * Math.sqrt(Math.max(0, 1 - t * t)), U1 = 25, Q1 = 6.3, J1 = { eyes: 1, mouth: -3.5 }, L0 = /* @__PURE__ */ new Map();
function ti(t, n, o) {
  const s = `${t}|${n}|${o}`;
  let a = L0.get(s);
  if (!a) {
    const e = un(t, -0.3 * n, 0.05 * n), r = un(t, -0.12 * n, 0.03 * n), i = [], l = [];
    for (let h = 0; h < Es; h++) {
      const d = h / (Es - 1);
      i.push(d > 0.6 ? "" : Na(e, r, d / 0.6)), l.push(d >= 0.5 ? t : Na(e, t, d / 0.5));
    }
    a = {
      base: t,
      far: e,
      near: r,
      light: un(t, 0.04 * o),
      dark: un(t, -0.3 * n, 0.05 * n),
      capTop: un(t, 0.035 * o),
      capBottom: un(t, -0.035 * n),
      crispMix: i,
      smoothMix: l,
      grad: null
    }, L0.size > 200 && L0.clear(), L0.set(s, a);
  }
  return a;
}
const Va = (t) => (t.startsWith("hsl(") ? t : un(t, 0)).match(/[\d.]+/g).map(Number);
function Na(t, n, o) {
  const s = Va(t), a = Va(n), e = s.map((r, i) => r + (a[i] - r) * o);
  return `hsl(${e[0].toFixed(1)} ${e[1].toFixed(1)}% ${e[2].toFixed(1)}%)`;
}
const Rs = 34, ni = Math.PI * 1.55, oi = 57, si = 0.4, Ua = -0.28, $0 = /* @__PURE__ */ new Map();
function ei(t) {
  let n = $0.get(t);
  return n || (n = { base: un(t, 0.1, 0.02), light: un(t, 0.3, 0.04), dark: un(t, -0.22, 0.08), halo: un(t, 0.2) }, $0.size > 200 && $0.clear(), $0.set(t, n)), n;
}
const E0 = (t, n) => t.replace(")", ` / ${Math.max(0, Math.min(1, n)).toFixed(3)})`);
function Qa(t, n, o, s, a, e, r) {
  const i = (r == null ? void 0 : r.strength) ?? 0, l = Math.min(1, n.whirl * i);
  if (l <= 0.01) return;
  const h = (r == null ? void 0 : r.size) ?? 1, d = (r == null ? void 0 : r.width) ?? 1, u = (r == null ? void 0 : r.length) ?? 1, c = (r == null ? void 0 : r.tilt) ?? 1, f = ni * u, b = ei(o), M = -n.whirlAngle, y = oi * h, m = y * si * c * (e ? 1.14 : 0.86), A = Math.atan2(a, s) - Ua;
  t.save(), t.rotate(Ua), t.translate(0, 5), t.lineCap = "butt";
  const g = (I, x, p, k, L) => {
    t.strokeStyle = k, t.lineWidth = p, t.beginPath(), t.ellipse(0, L, y, m, 0, I, x, !1), t.stroke();
  };
  if (e)
    for (let I = 0; I < Rs; I++) {
      const x = I / Rs, p = M + x * f, k = p + f / Rs + 0.012;
      if (Math.sin((k + p) / 2) <= 0) continue;
      const L = Math.pow(1 - x, 1.3);
      g(p, k, (2 + 8 * L) * 1.5 * d, `rgba(0,0,0,${(0.2 * l * L).toFixed(3)})`, 3.5);
    }
  for (let I = 0; I < Rs; I++) {
    const x = I / Rs, p = M + x * f, k = p + f / Rs + 0.012, L = (k + p) / 2;
    if (Math.sin(L) > 0 !== e) continue;
    const S = 0.6 + 0.4 * Math.sin(L), O = Math.pow(1 - x, 1.3), F = 1 + 0.18 * Math.sin(x * 9 + 1.2), W = (2 + 8 * O) * S * d * F, C = l * (0.3 + 0.7 * O) * S, $ = 0.5 + 0.5 * Math.cos(L - A);
    g(p, k, W * 2.6, E0(b.halo, C * 0.2), 0), g(p, k, W * 0.8, E0(b.dark, C * 0.45), W * 0.32), g(p, k, W, E0(b.base, C * 0.72), 0), g(p, k, W * 0.62, E0(b.light, C * 0.78 * (0.4 + 0.6 * $)), -W * 0.16), g(p, k, W * 0.24, `rgba(255,255,255,${(C * 0.9 * (0.15 + 0.85 * $ * $)).toFixed(3)})`, -W * 0.3);
  }
  t.restore();
}
const ai = (t) => {
  if (t === void 0 || !Number.isFinite(t)) return {};
  const n = t * Math.PI / 180;
  return { bx: Math.sin(n), by: -Math.cos(n) };
}, Gr = {
  fabric: { shadow: 1.15, highlight: 1.45, light: 295, rim: 0.6, spread: 1.6 },
  other: { shadow: 0.35, highlight: 1.3, light: 300, rim: 0.5, spread: 1.55 }
};
function Ja(t, n, o, s) {
  const a = n * ts;
  t.clearRect(0, 0, a, a);
  const e = n / 100;
  let r, i;
  if (s.dpr !== void 0)
    r = s.dpr, i = [r, 0, 0, r, 0, 0];
  else if (t.getTransform) {
    const ft = t.getTransform();
    i = [ft.a, ft.b, ft.c, ft.d, ft.e, ft.f], r = ft.a || 1;
  } else
    r = 1, i = [1, 0, 0, 1, 0, 0];
  const l = Gr[s.shading === "fabric" ? "fabric" : "other"], h = s.shadow ?? l.shadow, d = s.highlight ?? l.highlight, u = V1 * (s.depth ?? 0.65), c = s.rim ?? l.rim, f = 1 - (1 - N1) * c, b = s.spread ?? l.spread, M = (s.light ?? l.light) * Math.PI / 180, y = Math.sin(M), m = -Math.cos(M), A = ti(s.color, h, d), g = Math.cos(o.yaw), I = Math.sin(o.yaw), x = Math.cos(o.pitch), p = Math.sin(o.pitch), k = g * x, L = (ft) => Math.abs(ft) < 0.22 ? ft < 0 ? -0.22 : 0.22 : ft, S = L(g), O = L(x), F = Math.cos(o.roll), W = Math.sin(o.roll), C = o.sx * e, $ = o.sy * e, T = 50 * (1 - o.sy) * e, E = Hs(i, [F * C, W * C, -W * $, F * $, a / 2 + o.x * e - W * T, a / 2 + X0 * n + o.y * e + F * T]);
  t.save(), t.setTransform(E[0], E[1], E[2], E[3], E[4], E[5]), t.lineCap = "round", t.lineJoin = "round";
  const z = s.shading, B = (ft, Yt, _, wt = !0) => {
    let pn = A.near, gn = A.base;
    if (z === "crisp") {
      if (!A.grad || A.grad.lx !== y || A.grad.ly !== m) {
        const en = t.createLinearGradient(y * 56, m * 56, -y * 56, -m * 56);
        en.addColorStop(0, A.light), en.addColorStop(0.45, A.near), en.addColorStop(1, A.dark);
        const sn = t.createLinearGradient(y * 46, m * 46, -y * 46, -m * 46);
        sn.addColorStop(0, A.capTop), sn.addColorStop(1, A.capBottom), A.grad = { lx: y, ly: m, lit: en, cap: sn };
      }
      pn = A.grad.lit, gn = A.grad.cap;
    }
    let fn = !1;
    (z === "plastic" || z === "fabric") && (fn = $1(
      t,
      { ...s, path: ft, typeKey: Yt, shading: wt ? z : "plastic" },
      { cy: S, sy: I, cp: O, sp: p, facing: k, roll: o.roll, halfDepth: _, lx: y, ly: m, ...ai(s.backLight), dev: n * r, ctm: E, still: s.still, round: s.roundness ?? 1 },
      A,
      null,
      { shadow: h, highlight: d, spread: b, rim: c, vivid: s.vivid ?? 0, front: Math.min(85, Math.max(0, s.lightFront ?? 32)) * Math.PI / 180, shine: s.shine ?? 0, sheen: s.sheen ?? 0, backSoft: s.backSoftness ?? 1 }
    ));
    const Sn = (z === "plastic" || z === "fabric") && !fn ? "smooth" : z, rn = Sn === "smooth", Mn = rn && typeof Path2D == "function" ? new Path2D() : null, jt = k >= 0 ? 1 : -1, [Qt, Dt, Jt, Wn, Un, no] = E;
    let bn = null, Mo = 1, Qn = 0, qn = 0, mo = 1, Dn = 0, zo = 0;
    for (let en = 0; en < Es && !fn; en++) {
      const vn = -1 + 2 * (jt > 0 ? en : Es - 1 - en) / (Es - 1), An = Za(vn, f), xo = en / (Es - 1), oo = S * An, X = I * p * An, nt = O * An, ct = vn * I * _ - 50 * oo, U = -vn * S * p * _ - 50 * X - 50 * nt, tt = Mo * mo - Qn * qn, pt = mo / tt, nn = -Qn / tt, Wt = -qn / tt, lt = Mo / tt, yn = (qn * zo - mo * Dn) / tt, tn = (Qn * Dn - Mo * zo) / tt;
      t.transform(pt * oo + Wt * X, nn * oo + lt * X, Wt * nt, lt * nt, pt * ct + Wt * U + yn, nn * ct + lt * U + tn), Mo = oo, Qn = X, qn = 0, mo = nt, Dn = ct, zo = U;
      let an;
      rn ? an = A.smoothMix[en] : en === Es - 1 ? an = gn : xo > 0.6 ? an = pn : an = A.crispMix[en], an !== bn && (t.fillStyle = bn = an), t.fill(ft), Mn && Mn.addPath(ft, { a: oo, b: X, c: 0, d: nt, e: ct, f: U });
    }
    if (fn || t.setTransform(Qt, Dt, Jt, Wn, Un, no), Mn && Sn === "smooth") {
      t.save(), t.clip(Mn);
      const en = Math.min(1, 0.34 * h), sn = t.createRadialGradient(-y * 45, -m * 45, 4 * b, -y * 45, -m * 45, 84 * b);
      sn.addColorStop(0, `rgba(0,0,0,${en})`), sn.addColorStop(0.5, `rgba(0,0,0,${en * 0.35})`), sn.addColorStop(1, "rgba(0,0,0,0)"), t.globalCompositeOperation = "multiply", t.fillStyle = sn, t.fillRect(-120, -120, 240, 240), t.globalCompositeOperation = "source-over";
      const vn = Math.min(1, 0.22 * d), An = t.createRadialGradient(y * 37, m * 37, 0, y * 37, m * 37, 62 * b);
      An.addColorStop(0, `rgba(255,255,255,${vn})`), An.addColorStop(0.6, `rgba(255,255,255,${vn * 0.23})`), An.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = An, t.fillRect(-120, -120, 240, 240), t.restore();
    }
    return fn;
  };
  Qa(t, o, s.color, y, m, !1, s.whirl);
  const R = s.wear, Y = !!R && (R.hat !== "none" || R.glasses !== "none" || R.headphones || R.bowTie), et = { cy: S, sy: I, cp: O, sp: p, facing: k, lx: y, ly: m };
  Y && j1(t, s.path, et, R);
  const ht = s.typeKey ?? "custom", Et = s.parts ? Array.isArray(s.parts) ? s.parts : [s.parts] : [];
  for (let ft = 0; ft < Et.length; ft++) B(Et[ft], Array.isArray(s.parts) ? `${ht}:parts${ft}/${Et.length}` : `${ht}:parts`, u * (s.partsDepth ?? 0.4), !1);
  const Pt = B(s.path, ht, u), Ot = k >= 0 ? 1 : -1, Gt = s.roundness ?? 1, P = Pt, q = P ? 1 : Za(Ot, f), V = (ft, Yt) => P ? vc(ht, u, ft, Yt, Gt) ?? 0.8 * u : u * q, bt = P ? 0.55 * V(s.faceX, s.faceY) : u, G = S * q, N = I * p * q, dt = O * q, at = Ot * I * bt - 50 * G, At = -Ot * S * p * bt - 50 * N - 50 * dt;
  let D = null;
  if (Y && typeof Path2D == "function" && (D = new Path2D(), D.addPath(s.path, { a: G, b: N, c: 0, d: dt, e: at, f: At })), k > -0.2) {
    t.save();
    {
      const [wt, pn, gn, fn, Sn, rn] = E;
      t.setTransform(wt * G + gn * N, pn * G + fn * N, gn * dt, fn * dt, wt * at + gn * At + Sn, pn * at + fn * At + rn), t.clip(s.path), t.setTransform(wt, pn, gn, fn, Sn, rn);
    }
    t.translate(s.faceX - 50, s.faceY - 50), t.scale(s.faceScale, s.faceScale), z === "plastic" && Pt && (t.globalAlpha = 0.93);
    const ft = ii(t, o, s);
    t.globalAlpha = 1;
    const Yt = R && R.glasses !== "none" ? R.glasses : null, _ = { yaw: o.yaw, pitch: o.pitch };
    Yt && ja(t, Yt, ft, { lx: y, ly: m }, "shadow", _), t.restore(), Yt && (t.save(), t.translate(s.faceX - 50, s.faceY - 50), t.scale(s.faceScale, s.faceScale), ja(t, Yt, ft, { lx: y, ly: m }, "frame", _), t.restore());
  }
  Y && Z1(t, s.path, et, R, D, V, { y: s.faceY, scale: s.faceScale }), Qa(t, o, s.color, y, m, !0, s.whirl), t.restore();
}
const Xs = 30;
function tr(t, n, o, s) {
  const a = Math.asin(Math.max(-1, Math.min(1, t / Xs))) + o, e = Math.asin(Math.max(-1, Math.min(1, -n / Xs))) + s, r = Math.cos(e);
  return {
    x: Xs * Math.sin(a) * r,
    y: -Xs * Math.sin(e),
    sx: Math.cos(a),
    sy: r,
    z: Math.cos(a) * r
  };
}
const nr = 8, O0 = /* @__PURE__ */ new Map();
function ri(t, n, o) {
  const s = Math.round(t * 50), a = Math.round(n * 50), e = Math.round(o * 50), r = s + 2e3 * a + 4e6 * e;
  let i = O0.get(r);
  if (!i) {
    const l = s / 50, h = a / 50, d = e / 50;
    let u = `M${-l} ${h}`;
    for (let c = 1; c <= nr; c++) {
      const f = c / nr, b = 1 - f;
      u += ` L${(b * b * -l + f * f * l).toFixed(3)} ${((b * b + f * f) * h + 2 * b * f * d).toFixed(3)}`;
    }
    i = new Path2D(u), O0.size > 256 && O0.clear(), O0.set(r, i);
  }
  return i;
}
const or = Math.sin(0.684), sr = Math.cos(0.684), W0 = /* @__PURE__ */ new Map();
function ci(t) {
  const n = (L) => Math.round(L * 50) / 50, o = n(t.hw), s = n(t.t0), a = n(t.a), e = n(t.yt), r = n(t.ab), i = n(t.yb), l = `${o},${s},${a},${e},${r},${i}`;
  let h = W0.get(l);
  if (h) return h;
  const d = (L) => L.toFixed(3), u = s * or, c = s * sr, f = -o + u, b = -c, M = o - u, y = -c, m = -o - u, A = c, g = o + u, I = c, x = 4 / 3 * s * sr, p = 4 / 3 * s * or, k = `M${d(f)} ${d(b)}C${d(-o + a * o)} ${d(e - s)} ${d(o - a * o)} ${d(e - s)} ${d(M)} ${d(y)}C${d(M + x)} ${d(y - p)} ${d(g + x)} ${d(I - p)} ${d(g)} ${d(I)}C${d(o - r * o)} ${d(i + s)} ${d(-o + r * o)} ${d(i + s)} ${d(m)} ${d(A)}C${d(m - x)} ${d(A - p)} ${d(f - x)} ${d(b - p)} ${d(f)} ${d(b)}Z`;
  return h = new Path2D(k), W0.size > 256 && W0.clear(), W0.set(l, h), h;
}
function ii(t, n, o) {
  const [s, a, e] = n.w, r = o.ink, i = J1[o.face], l = U1 / 2, h = n.lookX, d = n.lookY, { yaw: u, pitch: c } = n, f = (S, O, F, W = 1) => {
    const C = tr(S, O, u, c);
    C.z <= 0.02 || W <= 0.01 || (t.save(), t.globalAlpha = W * Math.min(1, C.z * 5), t.translate(C.x, C.y), t.scale(Math.max(0.02, C.sx), Math.max(0.02, C.sy)), F(), t.restore());
  }, b = (S, O) => Math.abs(S) <= O ? 0 : Math.sign(S) * (Math.abs(S) - O) / (1 - O), M = (S) => Math.max(-1, Math.min(1, S)), y = b(M(-n.pitch / 0.26 - n.lookY / 7), 0.34), m = Math.abs(b(M(n.lookX / 4.5), 0.4)), A = Math.max(0.3, 1 + 0.55 * y - 0.1 * m), g = 1 - 0.05 * y + 0.12 * m, I = s + a * (1 - n.laugh), x = a * n.laugh, p = Math.max(0, -n.y) / 26, k = 0.5 + 0.5 * n.breath;
  for (const S of [-1, 1]) {
    const O = S < 0 ? n.blinkL : n.blinkR, F = Math.max(0, Math.min(1, n.eyeOpen * (1 - O))), W = I * F, C = I * (1 - F), $ = x, T = e, E = W * 0.01 + C * 5.4 + $ * 6.2 + T * 6, z = W * 1.1 * A + C * 0.6 + $ * (2.2 - p * 1.5) + T * (-1.4 + k), B = W * -3.3 * A + C * 0.6 + $ * (-11.4 - 4 * p) + T * (5.4 + 2 * k), R = W * Q1 * 2 * g + C * 2.8 + $ * 4.4 + T * 4, Y = h * (W + 0.5 * (C + $)), et = d * (W + 0.5 * C);
    f(S * l + Y, i + et, () => {
      t.strokeStyle = r, t.lineWidth = R, t.stroke(ri(E, z, B));
    });
  }
  if (o.face === "mouth") {
    const S = h * 0.35, O = (0.6 + 0.4 * s) * (1 + 0.06 * n.breath), F = (0.6 + 0.4 * a) * (1 + 0.25 * Math.max(0, -n.y) / 26), W = 2.7 * e * (1 + 0.25 * n.breath), C = (T, E, z) => s * T + a * E + e * z, $ = {
      hw: C(6.5 * O, 9.5 * F, W),
      t0: C(1.9, 0, 0),
      a: C(2 / 3, 2 / 3, 0),
      yt: C(3.53 * O, 1.6 * F, -4 * W / 3),
      ab: C(2 / 3, 0, 0),
      yb: C(3.53 * O, 17.3 * F, 4 * W / 3)
    };
    f(S, C(12.5, 11.6, 15.5), () => {
      t.fillStyle = r, t.fill(ci($));
    });
  }
  const L = (S) => {
    const O = tr(S, i, u, c);
    return { x: O.x, y: O.y, sx: O.sx, sy: O.sy, z: O.z, ox: S, oy: i, fz: Math.sqrt(Math.max(0, Xs * Xs - S * S - i * i)) };
  };
  return [L(-l), L(l)];
}
const os = { x: NaN, y: NaN }, Gs = /* @__PURE__ */ new Set();
let Uo = 0, K0 = 0;
function Br(t) {
  Uo = 0;
  const n = K0 ? Math.min(0.1, (t - K0) / 1e3) : 0;
  K0 = t, Gs.forEach((o) => o(n)), Gs.size && (Uo = requestAnimationFrame(Br));
}
function jr() {
  Uo || typeof document > "u" || document.hidden || (K0 = 0, Uo = requestAnimationFrame(Br));
}
let er = !1;
function li() {
  er || typeof document > "u" || (er = !0, document.addEventListener("pointermove", (t) => {
    os.x = t.clientX, os.y = t.clientY;
  }, { passive: !0 }), document.addEventListener("pointerleave", () => {
    os.x = NaN, os.y = NaN;
  }), window.addEventListener("blur", () => {
    os.x = NaN, os.y = NaN;
  }), document.addEventListener("visibilitychange", () => {
    document.hidden ? (Uo && cancelAnimationFrame(Uo), Uo = 0) : Gs.size && jr();
  }));
}
function hi(t) {
  return li(), Gs.add(t), jr(), () => {
    Gs.delete(t), !Gs.size && Uo && (cancelAnimationFrame(Uo), Uo = 0);
  };
}
function ar(t) {
  let n = 2166136261;
  for (let o = 0; o < t.length; o++) n = Math.imul(n ^ t.charCodeAt(o), 16777619);
  return (n >>> 0) % 1e3 / 1e3;
}
const uo = (t, n, o) => Math.min(o, Math.max(n, Number.isFinite(t) ? t : 1)), rr = /* @__PURE__ */ new Map();
function fi(t) {
  let n = rr.get(t);
  return n || (n = new Path2D(t), rr.set(t, n)), n;
}
const cr = /* @__PURE__ */ new Map();
function ui(t) {
  let n = cr.get(t);
  return n || (n = t.split(/(?=M)/).filter((o) => o.trim()).map((o) => new Path2D(o)), cr.set(t, n)), n;
}
const ir = 4e3, i0 = /* @__PURE__ */ new Map();
function q0() {
  if (H0()) return;
  for (const n of i0.values()) if (!n.ready()) return;
  const t = [...i0.values()];
  i0.clear();
  for (const n of t) n.show();
}
const Ee = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, bi = oc(function({
  type: n = "clover",
  path: o,
  face: s,
  state: a = "default",
  size: e = 64,
  color: r,
  ink: i,
  brightness: l,
  saturation: h,
  speed: d = 1,
  paused: u = !1,
  seed: c,
  shading: f = "fabric",
  hat: b = "none",
  glasses: M = "none",
  headphones: y = !1,
  bowTie: m = !1,
  accessoryColor: A = "#27272b",
  shadow: g,
  highlight: I,
  depth: x = 0.65,
  roundness: p = 1,
  furLength: k = 1,
  furDensity: L = 1.6,
  furFuzz: S = 0.9,
  furClumps: O = 0.4,
  furCurl: F = 0.7,
  furGravity: W = 0.9,
  light: C,
  rim: $,
  spread: T,
  backLight: E,
  lightFront: z,
  shine: B,
  sheen: R,
  backSoftness: Y,
  pose: et,
  interactive: ht = !0,
  turn: Et = 1,
  theme: Pt = "auto",
  whirl: Ot = 0,
  whirlSize: Gt = 1,
  whirlWidth: P = 1,
  whirlLength: q = 1,
  whirlTilt: V = 1,
  jumpHeight: bt = 26,
  jumpTime: G = 0.68,
  jumpStretch: N = 1,
  jumpSpin: dt = 1,
  jumpLean: at = 6,
  jumpEvery: At = 8,
  jumpLand: D = 0,
  jumpSquash: ft = 1.15,
  jumpSquashTime: Yt = 0.37,
  jumpSquashEase: _ = "pulse",
  jumpGroundTime: wt = 0.11,
  jumpGroundEase: pn = "pulse",
  jumpRiseTime: gn = 0.33,
  jumpRiseEase: fn = "pulse",
  jumpClickSquashTime: Sn = 0.24,
  className: rn,
  style: Mn,
  "aria-label": jt,
  ...Qt
}, Dt) {
  const Jt = to(null);
  sc(Dt, () => Jt.current);
  const Wn = ec(), Un = G0[n] ?? G0.clover, no = s ?? Un.face, bn = r ?? Un.color, Mo = l ?? Un.brightness ?? 1, Qn = h ?? Un.saturation ?? 1.5, qn = uo(Qn, 1.5, 2.5) - 1.5, mo = yc(
    Mo === 1 && Qn === 1 ? bn : un(bn, (Math.min(2, Math.max(0, Mo)) - 1) * 0.35, (Math.min(1.5, Math.max(0, Qn)) - 1) * 0.5),
    qn
  ), Dn = i ?? hc(mo), zo = Math.min(1, Math.max(0, c ?? ar(Wn))), en = a in ta ? a : "default", sn = u || !(d > 0), vn = f === !0 ? "crisp" : f === !1 ? "flat" : f, An = typeof o == "string" && o.trim() ? o.trim() : null, xo = An ? `path:${ar(An)}:${An.length}` : n, oo = Gr[vn === "fabric" ? "fabric" : "other"], X = (kt, _t, Nt) => Math.round(uo(kt, _t, Nt) * 20) / 20, nt = {
    length: X(k, 0.3, 2.5),
    density: X(L, 0.3, 2),
    fuzz: X(S, 0, 1),
    clumps: X(O, 0, 1),
    curl: X(F, 0, 1),
    gravity: X(W, 0, 1)
  }, ct = `${nt.length},${nt.density},${nt.fuzz},${nt.clumps},${nt.curl},${nt.gravity}`, U = to(null), tt = to(null), pt = to(0), nn = to(d);
  nn.current = d;
  const Wt = to(ht);
  Wt.current = ht && !et;
  const lt = to(et);
  lt.current = et, tt.current = {
    path: typeof Path2D > "u" ? null : fi(An ?? na[n] ?? na.clover),
    face: no,
    faceX: Un.faceX,
    faceY: Un.faceY,
    faceScale: Un.faceScale,
    color: mo,
    ink: Dn,
    shading: vn,
    shadow: uo(g ?? oo.shadow, 0, 2),
    highlight: uo(I ?? oo.highlight, 0, 2),
    depth: uo(x, 0.2, 2),
    roundness: uo(p, 0, 1),
    fur: nt,
    vivid: qn,
    backLight: E,
    lightFront: z,
    shine: B,
    sheen: R,
    backSoftness: Y,
    light: C ?? oo.light,
    rim: uo($ ?? oo.rim, 0, 2),
    spread: uo(T ?? oo.spread, 0.4, 2.5),
    typeKey: xo,
    still: sn || Ee(),
    furOnIdle: !0,
    whirl: { strength: uo(Ot, 0, 2), size: uo(Gt, 0.6, 1.6), width: uo(P, 0.4, 2), length: uo(q, 0.4, 1.6), tilt: uo(V, 0.5, 1.8) },
    parts: typeof Path2D < "u" && !An && oa[n] ? ui(oa[n]) : void 0,
    wear: { hat: b, glasses: M, headphones: y, bowTie: m, color: A, fabric: vn === "fabric" }
  };
  const yn = (kt) => {
    if (Pt !== "auto") return Pt;
    const _t = kt == null ? void 0 : kt.closest("[data-theme], .dark, .light");
    if (_t) {
      const Nt = _t.getAttribute("data-theme");
      if (Nt === "dark" || Nt === "light") return Nt;
      if (_t.classList.contains("dark")) return "dark";
      if (_t.classList.contains("light")) return "light";
    }
    return typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }, tn = () => {
    const kt = Jt.current, _t = tt.current;
    if (!kt || !_t || !_t.path) return;
    const Nt = kt.clientWidth / ts || pt.current || (typeof e == "number" ? e : 64);
    if (!Nt) return;
    const Fn = Math.min(2, typeof devicePixelRatio == "number" && devicePixelRatio || 1), so = Math.round(Nt * ts * Fn);
    (kt.width !== so || kt.height !== so) && (kt.width = so, kt.height = so), pt.current = Nt;
    const yo = kt.getContext("2d");
    if (!yo) return;
    yo.setTransform(Fn, 0, 0, Fn, 0, 0), _t.dpr = Fn;
    const fo = lt.current, So = ua(en), zn = fo ? { ...So, yaw: fo.yaw ?? 0, pitch: fo.pitch ?? So.pitch, roll: fo.roll ?? So.roll } : U.current ? U.current.pose : So;
    Ja(yo, Nt, zn, _t);
  }, an = to(null), In = to(null), cn = () => {
    In.current && In.current(), In.current = null;
  }, Tn = (kt) => {
    S0(), kt(), S0() ? In.current || (In.current = ge(() => {
      const _t = an.current;
      Jt.current && _t ? Tn(_t) : cn();
    })) : cn();
  };
  t0(() => cn, []);
  const ho = vn === "plastic" || vn === "fabric", [_n, Zt] = Je(!ho), ln = to(_n);
  ln.current = _n;
  const Vt = to(null), Pn = to(null), as = () => {
    Pn.current && Pn.current(), Pn.current = null;
  }, Vs = to({}), qs = to(!1), vs = (kt) => {
    if (Vt.current = kt, S0(), kt(), qs.current = !S0(), qs.current && !H0()) {
      q0();
      return;
    }
    Pn.current || (Pn.current = ge(() => {
      const _t = Vt.current;
      Jt.current && _t && !ln.current ? vs(_t) : as(), q0();
    }));
  };
  t0(() => {
    if (_n) return;
    i0.set(Vs.current, { ready: () => qs.current, show: () => Zt(!0) }), q0(), k0(!0);
    const kt = setTimeout(() => Zt(!0), ir);
    return () => {
      k0(!1), clearTimeout(kt), as(), i0.delete(Vs.current), q0();
    };
  }, [_n]);
  const Ds = () => {
    var fo;
    if (!ho || !((fo = tt.current) != null && fo.path)) return;
    const kt = tt.current.path, _t = (typeof e == "number" ? e : 64) * Math.min(2, typeof devicePixelRatio == "number" && devicePixelRatio || 1), Nt = tt.current.light ?? 295, Fn = Nt * Math.PI / 180, so = (E ?? 0) * Math.PI / 180, yo = M0(Math.sin(Fn), -Math.cos(Fn));
    E !== void 0 && ([yo.bx, yo.by] = [Math.sin(so), -Math.cos(so)]), z !== void 0 && (yo.front = Math.min(85, Math.max(0, z)) * Math.PI / 180), Wc(xo, kt, _t, x, vn === "fabric", nt, Nt, yo);
  }, [, Ft] = Je(0), Cs = `${vn}|${xo}|${e}`, Qo = to(null), ko = to(null), ws = () => {
    if (Ds(), !H0()) return;
    k0(!0);
    const kt = () => {
      ko.current && (ko.current(), Ft((Fn) => Fn + 1));
    }, _t = ge(() => {
      H0() || kt();
    }), Nt = setTimeout(kt, ir);
    ko.current = () => {
      _t(), clearTimeout(Nt), k0(!1), ko.current = null;
    };
  };
  t0(() => () => {
    var kt;
    return (kt = ko.current) == null ? void 0 : kt.call(ko);
  }, []), ac(() => {
    if (U.current ? U.current.setState(en) : U.current = new kc(zo, en), U.current.setTurn(uo(Et, 0, 2)), ln.current && ho && Qo.current !== null && Qo.current !== Cs && !ko.current && ws(), Qo.current = Cs, U.current.setJump({ height: bt, time: Math.max(0.2, G), stretch: N, spin: Math.max(0, Math.round(dt)), lean: at, every: At, land: D, squash: ft, squashTime: Math.max(0.05, Yt), squashEase: _, groundTime: Math.max(0, wt), groundEase: pn, riseTime: Math.max(0.05, gn), riseEase: fn, clickSquashTime: Math.max(0.05, Sn) }), !ko.current) {
      if (Ee()) {
        const kt = () => {
          const _t = Jt.current;
          if (!_t || !tt.current || !tt.current.path) return;
          const Nt = _t.clientWidth / ts || pt.current || (typeof e == "number" ? e : 64);
          if (!Nt) return;
          pt.current = Nt;
          const Fn = Math.min(2, typeof devicePixelRatio == "number" && devicePixelRatio || 1);
          _t.width = _t.height = Math.round(Nt * ts * Fn);
          const so = _t.getContext("2d");
          so && (tt.current.theme = yn(_t), tt.current.dpr = Fn, so.setTransform(Fn, 0, 0, Fn, 0, 0), Ja(so, Nt, ua(en), tt.current));
        };
        an.current = kt, ln.current ? Tn(kt) : vs(kt);
        return;
      }
      tt.current && Jt.current && (tt.current.theme = yn(Jt.current)), ln.current ? sn ? (an.current = tn, Tn(tn)) : (an.current = null, cn(), tn()) : (an.current = sn ? tn : null, vs(tn));
    }
  }), t0(() => {
    var Nt;
    if (!ho || !((Nt = tt.current) != null && Nt.path)) return;
    const _t = (typeof requestIdleCallback == "function" ? requestIdleCallback : (Fn) => setTimeout(Fn, 1))(Ds);
    return () => {
      typeof cancelIdleCallback == "function" ? cancelIdleCallback(_t) : clearTimeout(_t);
    };
  }, [vn, xo, e, x, ct, C, E, z]), t0(() => {
    if (sn || Ee()) return;
    const kt = Jt.current;
    if (!kt) return;
    let _t = !0, Nt = null;
    const Fn = 3, so = (zn) => {
      const Ro = U.current;
      if (Ro) {
        if (Wt.current && !Number.isNaN(os.x)) {
          const Io = kt.getBoundingClientRect(), _s = Io.width / ts || 1, Us = (os.x - (Io.left + Io.width / 2)) / _s, cs = (os.y - (Io.top + Io.height / 2 + X0 * _s)) / _s, is = Math.hypot(Us, cs), ks = is < 1 ? 1 : is > Fn ? 0 : 1 - (is - 1) / (Fn - 1);
          Ro.setPointer(Us / Math.max(1, is), cs / Math.max(1, is), ks);
        } else Ro.setPointer(0, 0, 0);
        Ro.update(zn * nn.current), ln.current && !ko.current && tn();
      }
    }, yo = () => {
      Nt || (Nt = hi(so));
    }, fo = () => {
      Nt && Nt(), Nt = null;
    };
    let So = null;
    return typeof IntersectionObserver == "function" ? (So = new IntersectionObserver((zn) => {
      var Ro;
      _t = ((Ro = zn[0]) == null ? void 0 : Ro.isIntersecting) ?? !0, _t ? yo() : fo();
    }), So.observe(kt)) : yo(), () => {
      fo(), So && So.disconnect();
    };
  }, [sn]);
  const Ns = typeof e == "number" ? `${e * ts}px` : `calc(${e} * ${ts})`, rs = (kt) => typeof e == "number" ? `${-e * kt}px` : `calc(${e} * ${-kt})`, xs = (ts - 1) / 2, oe = {
    display: "inline-block",
    verticalAlign: "middle",
    width: Ns,
    height: Ns,
    marginLeft: rs(xs),
    marginRight: rs(xs),
    marginTop: rs(xs + X0),
    marginBottom: rs(xs - X0),
    flex: "none",
    opacity: _n ? 1 : 0,
    transition: "opacity 0.3s ease-out",
    ...Mn
  }, y0 = (kt) => {
    var _t, Nt;
    ht && !sn && !et && ((_t = U.current) == null || _t.poke()), (Nt = Qt.onClick) == null || Nt.call(Qt, kt);
  };
  return /* @__PURE__ */ nc(
    "canvas",
    {
      ref: Jt,
      className: rn ? `ba ${rn}` : "ba",
      "data-bot-avatar": n,
      "data-face": no,
      "data-state": en,
      role: "img",
      "aria-label": jt ?? `${Un.label} bot, ${ta[en]}`,
      style: oe,
      ...Qt,
      onClick: y0
    }
  );
});
export {
  gi as BOT_AVATAR_MATCAP_SIZE,
  ts as BOT_AVATAR_OVERSCAN,
  ot as BOT_AVATAR_PAD,
  X0 as BOT_AVATAR_RISE,
  Tt as BOT_AVATAR_SPAN,
  bi as BotAvatar,
  kc as BotAvatarSim,
  hc as autoInk,
  Lc as bakeBotAvatarForm,
  x1 as botAvatarCapFrame,
  Mi as botAvatarFaces,
  aa as botAvatarJumpDefaults,
  yi as botAvatarPalette,
  oa as botAvatarParts,
  G0 as botAvatarPresets,
  na as botAvatarShapes,
  mi as botAvatarStates,
  Ar as botAvatarTier,
  rc as botAvatarTypes,
  Dc as buildBotAvatarMatcap,
  bi as default,
  Ja as drawBotAvatarFrame,
  cc as luminance,
  p0 as parseColor,
  ua as restPose,
  un as shade,
  zc as shadeBotAvatarTexels,
  Wc as warmBotAvatarPlastic
};
