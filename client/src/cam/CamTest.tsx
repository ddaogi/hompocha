import { useState, useRef, useEffect } from "react";
import UserVideoComponent from "./UserVideoComponent";
import styles from "./CamTest.module.scss";
// interface CamTwoProps {
//   state: any; // 적절한 타입으로 수정하세요.
//   num: number;
//   members: string[]; // 적절한 타입으로 수정하세요.
// }

// const CamTest: React.FC<CamTwoProps> = ({ state, num, members }) => {
const CamTest = (props: any) => {
  interface Props {
    index: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    num: number;
  }
  const num = props.user.getSubscriber().length + 1;
  const svgRef = useRef<SVGSVGElement>(null);
  const [flag, setFlag] = useState(0);
  const [counts, setCounts] = useState(0);
  const [angle, setAngle] = useState(360);
  let memberCount = props.user.subscribers.length + 1;
  const CamSlice: React.FC<Props> = ({
    index,
    radius,
    startAngle,
    endAngle,
    num,
  }) => {
    const cx = radius;
    const cy = radius;

    const mode = props.user.mode;
    const publisher = props.user.getStreamManager();
    const subscribers = props.user.getSubscriber();
    const members = [publisher, ...subscribers];

    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startAngleRad);
    const y1 = cy + radius * Math.sin(startAngleRad);
    const x2 = cx + radius * Math.cos(endAngleRad);
    const y2 = cy + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const pathData = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    const sliceStyle = {
      fill: "tomato",
      stroke: "black",
      strokeWidth: "3px",
    };

    const videoClipId = `fan-clip-${index}`;
    console.log("받았음? " + (counts - 1));
    return (
      <g>
        <foreignObject
          width="100%"
          height="100%"
          clipPath={`url(#${videoClipId})`}
        >
          {flag === 0 && (
            <UserVideoComponent
              streamManager={members[index]}
              index={index}
              num={num}
              mode={mode}
            />
          )}
          {flag === 1 && (
            <UserVideoComponent
              streamManager={members[counts - 1]}
              index={1}
              num={num}
              mode="roulette"
            />
          )}
        </foreignObject>
        <clipPath key={videoClipId} id={videoClipId}>
          <path d={pathData} />;
        </clipPath>
      </g>
    );
  };

  const [readyDrink, setreadyDrink] = useState(0);
  function readyToDrink() {
    setreadyDrink(1);
    setTimeout(() => {
      setreadyDrink(0);
    }, 2000);
  }

  const renderCamSlices = () => {
    const angle = 360 / num - 0.01;
    const pieSlices = [];

    for (let i = 0; i < num; i++) {
      const startAngle = angle * i;
      const endAngle = startAngle + angle;
      pieSlices.push(
        <CamSlice
          key={i}
          index={i}
          radius={350}
          startAngle={startAngle}
          endAngle={endAngle}
          num={num}
        />
      );
    }
    return pieSlices;
  };

  const roulette = () => {
    const randSlice = Math.floor(Math.random() * num);
    const rotations = Math.floor(Math.random() * 10) + 8;
    const targetAngleOffset = -180 + Math.random() * 360; // 변경된 무작위 각도 오프셋
    const targetAngle = -(
      360 * rotations +
      randSlice * (360 / num) +
      targetAngleOffset
    ); // 오프셋 추가
    const spinDuration = 9;
    const targetAnglePeople = Math.abs(targetAngle % 360);
    console.log("걸린사람 : " + targetAnglePeople);
    if (svgRef.current) {
      svgRef.current.style.transform = `rotate(${targetAngle}deg)`;
      svgRef.current.style.transformOrigin = "center";
      svgRef.current.style.transition = `transform ${spinDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    }
    console.log(num);

    let a = 0;
    console.log(num, angle);
    while (targetAnglePeople >= a) {
      a += angle;
      setCounts((prevCounts) => prevCounts + 1);
      console.log(a, counts);
    }
    setFlag(0);
    setTimeout(() => {
      setFlag(1);
      console.log(flag);
      setTimeout(() => {
        reset();
      }, 10);
      setTimeout(() => {
        setFlag(0);
        setCounts(0);
        console.log(flag, counts);
      }, 5000);
    }, 9000);
    const reset = () => {
      if (svgRef.current) {
        svgRef.current.style.transform = "rotate(0deg)";
        svgRef.current.style.transformOrigin = "center";
        svgRef.current.style.transition =
          "transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    };
  };

  useEffect(() => {
    setAngle(360 / num);
  }, [num]);

  function cheersImg() {
    const cheersImgGroup = [];
    for (let i = 0; i < 4; i++) {
      const img_class =
        readyDrink === 1
          ? `${styles.cheersImgVer} ${styles[`bottom${i}`]}`
          : `${styles.opacity}`;
      const img_src = "asset/cheers/cheers0" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} />);
    }
    for (let i = 10; i < 15; i++) {
      const img_class =
        readyDrink === 1
          ? `${styles.cheersImgVer} ${styles[`top${i}`]}`
          : `${styles.opacity}`;
      const img_src = "asset/cheers/cheers" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} />);
    }
    for (let i = 20; i < 24; i++) {
      const img_class =
        readyDrink === 1
          ? `${styles.cheersImgHor} ${styles[`left${i}`]}`
          : `${styles.opacity}`;
      const img_src = "asset/cheers/cheers" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} />);
    }
    for (let i = 30; i < 32; i++) {
      const img_class =
        readyDrink === 1
          ? `${styles.cheersImgHor} ${styles[`right${i}`]}`
          : `${styles.opacity}`;
      const img_src = "asset/cheers/cheers" + i + ".png";
      cheersImgGroup.push(<img className={img_class} src={img_src} />);
    }
    return cheersImgGroup;
  }

  return (
    <div>
      <div className={styles.triangleDown} />
      <div>
        <button type="submit" onClick={roulette}>
          {" "}
          돌려
        </button>
      </div>
      <div>
        <button type="submit" onClick={readyToDrink}>
          건배준비
        </button>
      </div>
      <div className={styles.scale}>
        <svg ref={svgRef} className={styles.position} width={700} height={700}>
          {renderCamSlices()}
        </svg>
      </div>
      {cheersImg()}
    </div>
  );
};

export default CamTest;
