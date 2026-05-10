import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useListProducts } from "@/lib/api";
import { ShoppingBag, Leaf, Droplets, Heart, ArrowLeft, Star, Shield, Truck } from "lucide-react";

/* ─────────────────────────────────────────
   BOTANICAL SVG ELEMENTS
───────────────────────────────────────── */

function LavenderSprig({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 80 130" fill="none">
      <defs>
        <linearGradient id="lavStem" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4a7a3a"/><stop offset="100%" stopColor="#7aaa5a"/></linearGradient>
        <linearGradient id="lavBud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c4aee8"/><stop offset="100%" stopColor="#7060b0"/></linearGradient>
        <radialGradient id="lavSheen" cx="30%" cy="30%"><stop offset="0%" stopColor="rgba(255,255,255,0.55)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      </defs>
      {/* Main stem with gradient */}
      <path d="M40 125 C39 105 38 85 40 65 C41 45 42 25 40 5" stroke="url(#lavStem)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Sub stems */}
      {[22,34,46,58,70,82,94].map((y, i) => (
        <g key={i} opacity={0.85 - i * 0.02}>
          {/* Left branch */}
          <path d={`M40 ${y} C${36-i*0.4} ${y-3} ${30-i*0.6} ${y-8} ${25-i} ${y-13}`} stroke="url(#lavStem)" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
          {/* Left bud body */}
          <ellipse cx={24-i} cy={y-16} rx="4.5" ry="7" fill="url(#lavBud)" opacity="0.82" transform={`rotate(-22 ${24-i} ${y-16})`}/>
          <ellipse cx={24-i} cy={y-16} rx="3" ry="4.5" fill="url(#lavSheen)" opacity="0.7" transform={`rotate(-22 ${24-i} ${y-16})`}/>
          {/* Left tiny petals */}
          <ellipse cx={22-i} cy={y-21} rx="2.5" ry="3.5" fill="#d8c8f0" opacity="0.6" transform={`rotate(-28 ${22-i} ${y-21})`}/>
          {/* Right branch */}
          <path d={`M40 ${y} C${44+i*0.4} ${y-3} ${50+i*0.6} ${y-8} ${55+i} ${y-13}`} stroke="url(#lavStem)" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
          <ellipse cx={56+i} cy={y-16} rx="4.5" ry="7" fill="url(#lavBud)" opacity="0.82" transform={`rotate(22 ${56+i} ${y-16})`}/>
          <ellipse cx={56+i} cy={y-16} rx="3" ry="4.5" fill="url(#lavSheen)" opacity="0.7" transform={`rotate(22 ${56+i} ${y-16})`}/>
          <ellipse cx={58+i} cy={y-21} rx="2.5" ry="3.5" fill="#d8c8f0" opacity="0.6" transform={`rotate(28 ${58+i} ${y-21})`}/>
        </g>
      ))}
      {/* Top flower cluster */}
      <ellipse cx="40" cy="8" rx="5" ry="7" fill="url(#lavBud)" opacity="0.9"/>
      <ellipse cx="40" cy="8" rx="3" ry="4.5" fill="url(#lavSheen)"/>
    </svg>
  );
}

function MintLeafCluster({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="mintMain" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#7fd48a"/><stop offset="50%" stopColor="#4a9a5a"/><stop offset="100%" stopColor="#2d6e3e"/></linearGradient>
        <linearGradient id="mintSide" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#9ee0a8"/><stop offset="100%" stopColor="#5aaa6a"/></linearGradient>
        <radialGradient id="mintGlow" cx="35%" cy="25%"><stop offset="0%" stopColor="rgba(255,255,255,0.4)"/><stop offset="70%" stopColor="transparent"/></radialGradient>
      </defs>
      {/* Shadow/depth layer */}
      <path d="M50 92 C22 77 12 50 18 24 C24 2 52 -2 68 14 C84 30 83 67 50 92Z" fill="#2d6e3e" opacity="0.25" transform="translate(3,4)"/>
      {/* Main leaf */}
      <path d="M50 90 C22 75 12 48 18 22 C24 0 52 -2 67 14 C83 30 82 66 50 90Z" fill="url(#mintMain)" opacity="0.92"/>
      {/* Midrib */}
      <path d="M50 88 C49 70 48 50 50 30 C51 18 52 8 50 2" stroke="#2a6038" strokeWidth="1.4" opacity="0.6" strokeLinecap="round"/>
      {/* Lateral veins */}
      {[20,30,40,50,60,70,80].map((y, i) => (
        <g key={i}>
          <path d={`M49 ${y} C${42-i*0.5} ${y-5} ${32-i} ${y-3}`} stroke="#2a6038" strokeWidth="0.9" opacity="0.45" strokeLinecap="round"/>
          <path d={`M51 ${y} C${58+i*0.5} ${y-5} ${68+i} ${y-3}`} stroke="#2a6038" strokeWidth="0.9" opacity="0.45" strokeLinecap="round"/>
        </g>
      ))}
      {/* Specular highlight */}
      <path d="M50 86 C35 70 27 50 30 28 C35 12 50 6 60 16" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="38" cy="30" rx="8" ry="14" fill="url(#mintGlow)" transform="rotate(-20 38 30)"/>
      {/* Left side leaf */}
      <path d="M36 72 C14 57 8 34 16 16 C20 6 37 4 44 17 C51 30 50 56 36 72Z" fill="url(#mintSide)" opacity="0.7" transform="rotate(-28 36 72)"/>
      <path d="M36 70 C24 56 20 38 24 22" stroke="#3d8a4a" strokeWidth="0.9" opacity="0.4" strokeLinecap="round" transform="rotate(-28 36 72)"/>
      {/* Right side leaf */}
      <path d="M64 68 C84 52 88 30 80 14 C76 5 59 4 53 17 C47 30 49 54 64 68Z" fill="url(#mintSide)" opacity="0.7" transform="rotate(22 64 68)"/>
      <path d="M64 66 C76 52 80 34 76 18" stroke="#3d8a4a" strokeWidth="0.9" opacity="0.4" strokeLinecap="round" transform="rotate(22 64 68)"/>
      {/* Tiny dewdrop */}
      <ellipse cx="60" cy="28" rx="2.5" ry="3" fill="rgba(200,245,220,0.7)" opacity="0.8"/>
      <ellipse cx="59" cy="27" rx="1" ry="1.5" fill="rgba(255,255,255,0.6)"/>
    </svg>
  );
}

function EucalyptusBranch({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 150 120" fill="none">
      <defs>
        <linearGradient id="eucBranch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6a8a5a"/><stop offset="100%" stopColor="#4a6a3a"/></linearGradient>
        <linearGradient id="eucLeaf1" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#a0cc90"/><stop offset="100%" stopColor="#5a8a5a"/></linearGradient>
        <linearGradient id="eucLeaf2" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#8abb7a"/><stop offset="100%" stopColor="#4a7a4a"/></linearGradient>
      </defs>
      {/* Main branch */}
      <path d="M8 112 C25 96 45 80 70 60 C95 40 118 24 142 8" stroke="url(#eucBranch)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Secondary branches */}
      <path d="M35 90 C28 78 22 68 20 55" stroke="url(#eucBranch)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M90 48 C96 38 100 28 105 18" stroke="url(#eucBranch)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* Eucalyptus leaves — detailed oval with vein */}
      {([[30,88,-42],[48,73,-36],[65,58,-30],[82,45,-24],[100,32,-18],[118,20,-12]] as [number,number,number][]).map(([x,y,rot], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
          {/* Shadow */}
          <ellipse cx="2" cy="-13" rx="9.5" ry="17" fill="#3a6a3a" opacity="0.2" transform="translate(2,2)"/>
          {/* Leaf body */}
          <ellipse cx="0" cy="-14" rx="9.5" ry="17" fill={i%2===0?"url(#eucLeaf1)":"url(#eucLeaf2)"} opacity="0.88"/>
          {/* Midrib */}
          <line x1="0" y1="-1" x2="0" y2="-27" stroke="#3a6a3a" strokeWidth="0.9" opacity="0.55"/>
          {/* Lateral veins */}
          <path d={`M0 -8 Q-5 -10 -8 -9`} stroke="#3a6a3a" strokeWidth="0.6" opacity="0.35"/>
          <path d={`M0 -14 Q-6 -16 -8 -15`} stroke="#3a6a3a" strokeWidth="0.6" opacity="0.35"/>
          <path d={`M0 -20 Q-5 -22 -7 -21`} stroke="#3a6a3a" strokeWidth="0.6" opacity="0.35"/>
          {/* Highlight */}
          <ellipse cx="-3" cy="-19" rx="3.5" ry="7" fill="rgba(255,255,255,0.25)" transform="rotate(-5 -3 -19)"/>
          {/* Berry/bud */}
          <circle cx="0" cy="-29" r="3" fill="#c8e8b8" opacity="0.85"/>
          <circle cx="-1" cy="-30" r="1.2" fill="rgba(255,255,255,0.5)"/>
        </g>
      ))}
      {/* Small paired leaves on secondary */}
      {([[22,60,-50],[24,50,-45]] as [number,number,number][]).map(([x,y,rot],i)=>(
        <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
          <ellipse cx="0" cy="-10" rx="6" ry="11" fill="url(#eucLeaf2)" opacity="0.75"/>
          <line x1="0" y1="-1" x2="0" y2="-19" stroke="#3a6a3a" strokeWidth="0.7" opacity="0.4"/>
        </g>
      ))}
    </svg>
  );
}

function SageBranch({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 110 100" fill="none">
      <defs>
        <linearGradient id="sageStem" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5a8a5a"/><stop offset="100%" stopColor="#8aaa6a"/></linearGradient>
        <linearGradient id="sageLeafA" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#b0c89a"/><stop offset="50%" stopColor="#8aaa7a"/><stop offset="100%" stopColor="#5a7a4a"/></linearGradient>
        <linearGradient id="sageLeafB" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#c0d4a8"/><stop offset="100%" stopColor="#7a9a5a"/></linearGradient>
        <radialGradient id="sageSheen" cx="25%" cy="20%"><stop offset="0%" stopColor="rgba(255,255,255,0.35)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      </defs>
      {/* Main stem */}
      <path d="M55 96 C53 78 51 60 50 42 C49 28 51 14 55 4" stroke="url(#sageStem)" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      {/* Leaf pairs along stem */}
      {([22,36,50,64,78] as number[]).map((y, i) => {
        const shrink = i * 1.5;
        return (
          <g key={i}>
            {/* Left leaf */}
            <path d={`M52 ${y} C${36-shrink} ${y-10} ${18-shrink} ${y} C${36-shrink} ${y+10} 52 ${y}Z`}
              fill={i%2===0?"url(#sageLeafA)":"url(#sageLeafB)"} opacity="0.85"/>
            <path d={`M52 ${y} C${40-shrink} ${y-5} ${26-shrink} ${y}`} stroke="#4a7a3a" strokeWidth="0.8" opacity="0.45" strokeLinecap="round"/>
            <path d={`M44-${i} ${y-3} C${36-shrink} ${y-7} ${28-shrink} ${y-5}`} stroke="#4a7a3a" strokeWidth="0.55" opacity="0.3" strokeLinecap="round"/>
            <ellipse cx={`${32-shrink}`} cy={`${y}`} rx="8" ry="5" fill="url(#sageSheen)" opacity="0.6"/>
            {/* Right leaf */}
            <path d={`M58 ${y} C${74+shrink} ${y-10} ${92+shrink} ${y} C${74+shrink} ${y+10} 58 ${y}Z`}
              fill={i%2===0?"url(#sageLeafA)":"url(#sageLeafB)"} opacity="0.85"/>
            <path d={`M58 ${y} C${70+shrink} ${y-5} ${84+shrink} ${y}`} stroke="#4a7a3a" strokeWidth="0.8" opacity="0.45" strokeLinecap="round"/>
            <ellipse cx={`${74+shrink}`} cy={`${y}`} rx="8" ry="5" fill="url(#sageSheen)" opacity="0.6"/>
          </g>
        );
      })}
      {/* Top bud */}
      <ellipse cx="55" cy="6" rx="5" ry="7" fill="url(#sageLeafA)" opacity="0.9"/>
      <ellipse cx="54" cy="5" rx="2.5" ry="3.5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   MOLECULAR PATTERN (very subtle background)
───────────────────────────────────────── */
function MolecularPattern() {
  const nodes = [
    [15,12],[32,8],[48,20],[62,8],[78,15],
    [8,35],[25,28],[42,38],[58,30],[74,38],[90,28],
    [18,55],[35,48],[52,58],[68,50],[84,56],
    [10,75],[28,68],[45,78],[62,70],[78,78],[92,70],
    [20,92],[38,88],[55,95],[72,88],[88,95],
  ];
  const bonds = [
    [0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,7],[3,8],[4,9],
    [5,6],[6,7],[7,8],[8,9],[9,10],[5,11],[6,12],[7,13],[8,14],[9,15],[10,15],
    [11,12],[12,13],[13,14],[14,15],[11,16],[12,17],[13,18],[14,19],[15,20],
    [16,17],[17,18],[18,19],[19,20],[21,16],[17,22],[18,23],[19,24],[20,24],
    [21,22],[22,23],[23,24],
  ];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice" opacity="0.07">
      {bonds.map(([a,b],i) => (
        <line key={i}
          x1={nodes[a]?.[0]} y1={nodes[a]?.[1]}
          x2={nodes[b]?.[0]} y2={nodes[b]?.[1]}
          stroke="#4a7a4a" strokeWidth="0.3" />
      ))}
      {nodes.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%4===0?"1.2":"0.7"}
          fill={i%4===0?"#4a7a4a":"#6a9a6a"} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────
   FLOWING WAVE SHAPE
───────────────────────────────────────── */
function WaveBottom({ fill = "#0a2e18" }: { fill?: string }) {
  return (
    <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: 80 }}>
      <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,80 L0,80 Z" fill={fill} opacity="0.9" />
      <path d="M0,55 C200,30 500,70 720,50 C940,30 1200,65 1440,45 L1440,80 L0,80 Z" fill={fill} opacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   WATER DROP CANVAS (dark transition section)
───────────────────────────────────────── */
type Ripple = { x: number; y: number; r: number; maxR: number; age: number; life: number };
type FallingDrop = { x: number; y: number; vy: number; size: number; opacity: number; landed: boolean };
type SplashParticle = { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number };

function WaterDropLeafCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = 0, H = 0;
    const resize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
    resize(); window.addEventListener("resize", resize);
    const drawLeaf = () => {
      const bg = ctx.createRadialGradient(W*.5,H*.4,0,W*.5,H*.4,Math.max(W,H)*.9);
      bg.addColorStop(0,"#0f4a22"); bg.addColorStop(.35,"#0a3318"); bg.addColorStop(.7,"#072210"); bg.addColorStop(1,"#041508");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      ctx.save(); ctx.globalAlpha=.07; ctx.strokeStyle="#86efac"; ctx.lineWidth=2.5; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(W*.5,0); ctx.bezierCurveTo(W*.5,H*.3,W*.52,H*.6,W*.5,H); ctx.stroke();
      const veins=[[.5,.15,.15,.28],[.5,.15,.85,.28],[.5,.3,.1,.45],[.5,.3,.9,.45],[.5,.45,.08,.6],[.5,.45,.92,.6],[.5,.6,.12,.75],[.5,.6,.88,.75],[.5,.75,.18,.88],[.5,.75,.82,.88]];
      ctx.lineWidth=1.2; ctx.globalAlpha=.05;
      veins.forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(W*x1,H*y1);ctx.quadraticCurveTo(W*((x1+x2)/2),H*((y1+y2)/2-.05),W*x2,H*y2);ctx.stroke();});
      ctx.restore();
    };
    const ripples:Ripple[]=[]; const fallingDrops:FallingDrop[]=[]; const splashParticles:SplashParticle[]=[];
    const spawnDrop=()=>fallingDrops.push({x:W*(.08+Math.random()*.84),y:-20,vy:3.5+Math.random()*4,size:4+Math.random()*6,opacity:.55+Math.random()*.35,landed:false});
    const land=(x:number,y:number,size:number)=>{
      const maxR=30+size*6;
      ripples.push({x,y,r:2,maxR,age:0,life:90},{x,y,r:1,maxR:maxR*.6,age:0,life:70},{x,y,r:.5,maxR:maxR*1.35,age:8,life:110});
      const count=6+Math.floor(Math.random()*6);
      for(let i=0;i<count;i++){const angle=(Math.PI*2*i)/count+(Math.random()-.5)*.5;const speed=1.5+Math.random()*3;splashParticles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-3,r:1.5+Math.random()*2,life:0,maxLife:30+Math.random()*20});}
    };
    const drawTeardrop=(x:number,y:number,r:number,op:number)=>{
      ctx.save();ctx.globalAlpha=op;
      const grad=ctx.createRadialGradient(x-r*.2,y-r*.2,r*.1,x,y,r);
      grad.addColorStop(0,"rgba(220,255,240,0.95)");grad.addColorStop(.4,"rgba(134,239,172,0.7)");grad.addColorStop(1,"rgba(34,197,94,0.3)");
      ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(x,y+r*.3,r*.7,r,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(x,y-r*1.4);ctx.quadraticCurveTo(x+r*.5,y-r*.3,x+r*.65,y+r*.1);ctx.quadraticCurveTo(x,y+r*.5,x-r*.65,y+r*.1);ctx.quadraticCurveTo(x-r*.5,y-r*.3,x,y-r*1.4);ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.45)";ctx.beginPath();ctx.ellipse(x-r*.22,y-r*.5,r*.22,r*.35,-.5,0,Math.PI*2);ctx.fill();ctx.restore();
    };
    let frameCount=0,nextSpawn=40,raf:number;
    const animate=()=>{
      frameCount++;drawLeaf();
      if(frameCount>=nextSpawn&&fallingDrops.length<6){spawnDrop();nextSpawn=frameCount+50+Math.floor(Math.random()*80);}
      ripples.forEach(rp=>{rp.age++;const progress=rp.age/rp.life;const currentR=rp.r+(rp.maxR-rp.r)*Math.pow(progress,.6);const alpha=(1-progress)*.55;if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=`rgba(134,239,172,${alpha})`;ctx.lineWidth=1.2*(1-progress*.7);ctx.beginPath();ctx.ellipse(rp.x,rp.y,currentR,currentR*.28,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=`rgba(220,255,240,${alpha*.5})`;ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(rp.x,rp.y,currentR*.55,currentR*.55*.28,0,0,Math.PI*2);ctx.stroke();ctx.restore();});
      for(let i=ripples.length-1;i>=0;i--)if(ripples[i].age>=ripples[i].life)ripples.splice(i,1);
      splashParticles.forEach(sp=>{sp.life++;sp.vy+=.18;sp.x+=sp.vx;sp.y+=sp.vy;const a=(1-sp.life/sp.maxLife)*.8;if(a<=0)return;ctx.save();ctx.globalAlpha=a;const g=ctx.createRadialGradient(sp.x,sp.y,0,sp.x,sp.y,sp.r);g.addColorStop(0,"rgba(220,255,240,0.9)");g.addColorStop(1,"rgba(74,222,128,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(sp.x,sp.y,sp.r,0,Math.PI*2);ctx.fill();ctx.restore();});
      for(let i=splashParticles.length-1;i>=0;i--)if(splashParticles[i].life>=splashParticles[i].maxLife)splashParticles.splice(i,1);
      fallingDrops.forEach(d=>{if(d.landed)return;d.y+=d.vy;drawTeardrop(d.x,d.y,d.size,d.opacity);if(d.y>H*.88){d.landed=true;land(d.x,d.y,d.size);}});
      for(let i=fallingDrops.length-1;i>=0;i--)if(fallingDrops[i].landed)fallingDrops.splice(i,1);
      raf=requestAnimationFrame(animate);
    };
    animate();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{display:"block"}} />;
}

/* ─────────────────────────────────────────
   SCROLL FADE-UP WRAPPER
───────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-80px" }}
      transition={{ duration:0.7, delay, ease:[0.22,1,0.36,1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FLOATING BOTANICAL ELEMENT
───────────────────────────────────────── */
function FloatingBotanical({ children, x, y, rotate, scale, dur, delay, blur = 0 }: {
  children: React.ReactNode; x: string; y: string;
  rotate: number; scale: number; dur: number; delay: number; blur?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, filter: blur > 0 ? `blur(${blur}px)` : undefined }}
      animate={{ y: [-8, 8, -8], rotate: [rotate - 3, rotate + 3, rotate - 3] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}>
      <div style={{ transform: `rotate(${rotate}deg) scale(${scale})`, transformOrigin: "center" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const { data: products, isLoading } = useListProducts();
  const featured = products?.slice(0, 4) || [];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div className="w-full flex flex-col">

      {/* ══════════════════════════════════════
          HERO — Light Botanical
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-screen overflow-hidden flex flex-col"
        style={{ background: "linear-gradient(155deg, #eef7ec 0%, #f2f8ee 25%, #f7fbf3 55%, #f0f5e8 80%, #e8f2e2 100%)" }}>

        {/* Molecular pattern background */}
        <MolecularPattern />

        {/* Ambient color orbs — CSS slow breathe */}
        <div className="lux-ambient absolute pointer-events-none"
          style={{ "--dur": "9s", "--op-lo": "0.7", "--op-hi": "1", left: "5%", top: "10%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(106,170,106,0.12) 0%, transparent 70%)" } as React.CSSProperties} />
        <div className="lux-ambient absolute pointer-events-none"
          style={{ "--dur": "11s", "--delay": "2s", "--op-lo": "0.5", "--op-hi": "0.8", right: "5%", top: "20%", width: 400, height: 400,
            background: "radial-gradient(circle, rgba(139,125,186,0.08) 0%, transparent 70%)" } as React.CSSProperties} />
        <div className="lux-ambient absolute pointer-events-none"
          style={{ "--dur": "8s", "--delay": "1s", "--op-lo": "0.6", "--op-hi": "0.95", left: "40%", bottom: "15%", width: 350, height: 350,
            background: "radial-gradient(circle, rgba(180,210,155,0.15) 0%, transparent 70%)" } as React.CSSProperties} />

        {/* Slow light beams */}
        <div className="hero-light-beam absolute pointer-events-none" style={{ left: "12%", top: 0, animationDelay: "0s" }} />
        <div className="hero-light-beam absolute pointer-events-none" style={{ left: "38%", top: 0, animationDelay: "-4s", opacity: 0.6 }} />
        <div className="hero-light-beam absolute pointer-events-none" style={{ right: "18%", top: 0, animationDelay: "-8s", opacity: 0.5 }} />

        {/* ── Floating botanical elements ── */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">

          {/* Lavender — back left */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"14s","--delay":"0s","--tz":"-180px","--rot":"10deg","--rx":"2deg","--ry":"-4deg",
              left:"-2%", top:"8%", filter:"blur(1.5px)", transform:"scale(1.1)" } as React.CSSProperties}>
            <LavenderSprig size={130} />
          </div>

          {/* Eucalyptus — top right */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"16s","--delay":"-3s","--tz":"-140px","--rot":"-25deg","--rx":"-1deg","--ry":"3deg",
              left:"62%", top:"2%", filter:"blur(0.5px)", transform:"scale(1.2)" } as React.CSSProperties}>
            <EucalyptusBranch size={200} />
          </div>

          {/* Mint cluster — mid left */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"12s","--delay":"-6s","--tz":"-60px","--rot":"-15deg","--rx":"3deg","--ry":"-2deg",
              left:"3%", top:"45%", transform:"scale(1.3)" } as React.CSSProperties}>
            <MintLeafCluster size={120} />
          </div>

          {/* Sage — right side */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"11s","--delay":"-2s","--tz":"-80px","--rot":"20deg","--rx":"-2deg","--ry":"4deg",
              left:"82%", top:"35%", transform:"scale(1.0)" } as React.CSSProperties}>
            <SageBranch size={130} />
          </div>

          {/* Small lavender — top mid */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"13s","--delay":"-9s","--tz":"-220px","--rot":"5deg","--rx":"1deg","--ry":"-1deg",
              left:"45%", top:"-2%", filter:"blur(2px)", transform:"scale(0.7)" } as React.CSSProperties}>
            <LavenderSprig size={80} />
          </div>

          {/* Eucalyptus small — bottom left */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"15s","--delay":"-5s","--tz":"-160px","--rot":"30deg","--rx":"-1deg","--ry":"2deg",
              left:"10%", top:"72%", filter:"blur(1px)", transform:"scale(0.85)" } as React.CSSProperties}>
            <EucalyptusBranch size={140} />
          </div>

          {/* Mint small — bottom right */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"10s","--delay":"-1s","--tz":"-100px","--rot":"-10deg","--rx":"2deg","--ry":"-3deg",
              left:"78%", top:"68%", filter:"blur(0.5px)", transform:"scale(0.9)" } as React.CSSProperties}>
            <MintLeafCluster size={100} />
          </div>

          {/* Lavender — far right deep */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"18s","--delay":"-12s","--tz":"-280px","--rot":"-5deg","--rx":"1deg","--ry":"1deg",
              left:"88%", top:"5%", filter:"blur(3px)", transform:"scale(0.6)" } as React.CSSProperties}>
            <LavenderSprig size={100} />
          </div>

          {/* Sage small — bottom mid */}
          <div className="lux-float-3d absolute pointer-events-none"
            style={{ "--dur":"12s","--delay":"-7s","--tz":"-190px","--rot":"-20deg","--rx":"-1deg","--ry":"2deg",
              left:"55%", top:"75%", filter:"blur(1.5px)", transform:"scale(0.75)" } as React.CSSProperties}>
            <SageBranch size={90} />
          </div>
        </motion.div>

        {/* Subtle floating pollen spores — CSS slow drift */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i}
              className="lux-spore absolute rounded-full"
              style={{
                "--dur": `${7 + (i % 5) * 2}s`,
                "--delay": `-${(i * 0.9) % 7}s`,
                "--dx": `${(i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 6)}px`,
                "--dx2": `${(i % 2 === 0 ? -1 : 1) * (8 + (i % 3) * 4)}px`,
                "--spin": `${(i % 2 === 0 ? 1 : -1) * (20 + i * 3)}deg`,
                "--spin2": `${(i % 2 === 0 ? -1 : 1) * 10}deg`,
                left: `${5 + (i * 4.7) % 90}%`,
                top: `${10 + (i * 3.9) % 78}%`,
                width: 3 + (i % 3),
                height: 3 + (i % 3),
                background: i % 3 === 0
                  ? "radial-gradient(circle,rgba(139,125,186,0.55),transparent)"
                  : i % 3 === 1
                  ? "radial-gradient(circle,rgba(90,154,106,0.45),transparent)"
                  : "radial-gradient(circle,rgba(180,160,100,0.45),transparent)",
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* ── Header ── */}
        <header className="relative z-30 flex items-center justify-between px-6 md:px-10 py-5"
          style={{ background: "rgba(240,248,235,0.75)", backdropFilter: "blur(20px) saturate(150%)",
            borderBottom: "1px solid rgba(90,154,90,0.12)" }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm"
              style={{ border: "2px solid rgba(90,154,90,0.4)", boxShadow: "0 2px 12px rgba(90,154,90,0.15)" }}>
              <img src="/images/logo.png" alt="طبيعة نقية" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-black text-sm leading-none" style={{ color: "#2d5a2d" }}>طبيعة نقية</div>
              <div className="text-xs" style={{ color: "rgba(90,120,90,0.7)" }}>جمال طبيعي</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: "rgba(45,90,45,0.6)" }}>
            {[{ label: "الرئيسية", href: "/" }, { label: "المنتجات", href: "/products" }].map(({ label, href }) => (
              <Link key={href} href={href}>
                <span className="hover:text-[#2d5a2d] cursor-pointer transition-colors duration-300 relative group">
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-[#5a9a5a] transition-all duration-300 rounded-full" />
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm"
                style={{ background: "linear-gradient(135deg,#4a8a4a,#5aaa5a)",
                  color: "#fff", boxShadow: "0 4px 16px rgba(74,138,74,0.35)" }}>
                <ShoppingBag className="w-4 h-4" />
                تسوق الآن
              </motion.button>
            </Link>
            <Link href="/products" className="md:hidden">
              <motion.button whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#4a8a4a,#5aaa5a)", color: "#fff" }}>
                <ShoppingBag className="w-3.5 h-3.5" /> المنتجات
              </motion.button>
            </Link>
          </div>
        </header>

        {/* ── Hero content ── */}
        <motion.div style={{ opacity: heroOpacity }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 py-10 md:py-16 pb-28">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="lux-glint inline-flex items-center gap-2.5 mb-8 px-5 py-2 rounded-full text-xs font-semibold"
            style={{ "--delay": "2s", background: "rgba(90,154,90,0.1)", color: "#3a7a3a",
              border: "1px solid rgba(90,154,90,0.25)", backdropFilter: "blur(12px)" } as React.CSSProperties}>
            <span className="lux-breathe inline-block"
              style={{ "--dur": "2.2s", "--op-lo": "0.7", "--op-hi": "1",
                width: 7, height: 7, borderRadius: "50%", background: "#5aaa5a",
                boxShadow: "0 0 8px rgba(90,170,90,0.6)" } as React.CSSProperties} />
            طبيعة أصيلة • نقاء حقيقي
          </motion.div>

          {/* ══ CENTRAL LOGO — dominant hero element ══ */}
          <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 1.1, type: "spring", stiffness: 70, damping: 14 }}
            className="relative flex items-center justify-center mb-8"
            style={{ width: 340, height: 340 }}>

            {/* Wide ambient glow behind everything */}
            <div className="lux-ambient absolute rounded-full pointer-events-none"
              style={{ "--dur":"8s","--op-lo":"0.5","--op-hi":"0.9",
                width: 380, height: 380,
                background: "radial-gradient(circle, rgba(90,154,90,0.22) 0%, rgba(180,220,170,0.08) 55%, transparent 75%)",
                filter: "blur(22px)" } as React.CSSProperties} />

            {/* Rotating rings */}
            {[{ r: 330, op: 0.13, dur: "72s", color: "rgba(90,154,90,0.55)",    rev: false },
              { r: 296, op: 0.17, dur: "52s", color: "rgba(139,125,186,0.5)",   rev: true  },
              { r: 260, op: 0.2,  dur: "36s", color: "rgba(90,154,90,0.65)",    rev: false },
              { r: 226, op: 0.15, dur: "22s", color: "rgba(212,175,55,0.45)",   rev: true  }].map(({ r, op, dur, color, rev }, i) => (
              <div key={i}
                className={`absolute rounded-full border ${i % 2 === 0 ? "border-dashed" : "border-dotted"} ${rev ? "lux-ring-rev" : "lux-ring"}`}
                style={{ "--dur": dur, width: r, height: r, borderColor: color, opacity: op } as React.CSSProperties} />
            ))}

            {/* Orbiting dots */}
            {[{ dur:"22s", color:"#8b7dba", shadow:"rgba(139,125,186,0.8)", size:310, offset:152 },
              { dur:"34s", color:"#5a9a5a", shadow:"rgba(90,154,90,0.8)",   size:296, offset:145 },
              { dur:"17s", color:"#d4af37", shadow:"rgba(212,175,55,0.7)",  size:266, offset:130 },
              { dur:"44s", color:"#f87171", shadow:"rgba(248,113,113,0.6)", size:278, offset:136 }].map(({ dur, color, shadow, size, offset }, i) => (
              <div key={i}
                className={`absolute ${i % 2 === 0 ? "lux-orbit" : "lux-orbit-rev"}`}
                style={{ "--dur": dur, width: size, height: size } as React.CSSProperties}>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 7 + (i % 3), height: 7 + (i % 3),
                  borderRadius: "50%", background: color, opacity: 0.7,
                  transform: `rotate(${i * 55}deg) translateX(${offset}px) translateY(-50%)`,
                  boxShadow: `0 0 18px ${shadow}`,
                }} />
              </div>
            ))}

            {/* THE LOGO — large glass medallion */}
            <div className="lux-sphere-float lux-glass-shimmer relative rounded-full overflow-hidden flex items-center justify-center z-10"
              style={{ width: 280, height: 280,
                background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98) 0%, rgba(240,252,240,0.94) 60%, rgba(220,245,220,0.88) 100%)",
                backdropFilter: "blur(28px) saturate(200%)",
                border: "3.5px solid rgba(255,255,255,1)",
                boxShadow: [
                  "0 20px 80px rgba(74,138,74,0.45)",
                  "0 4px 0 rgba(255,255,255,0.98) inset",
                  "0 -4px 0 rgba(74,138,74,0.18) inset",
                  "0 0 0 8px rgba(90,154,90,0.08)",
                  "0 0 120px rgba(90,154,90,0.2)",
                ].join(",") }}>

              <img src="/images/logo.png" alt="طبيعة نقية"
                className="relative z-10 rounded-full object-cover"
                style={{ width: "92%", height: "92%",
                  filter: "drop-shadow(0 6px 18px rgba(60,120,60,0.35)) drop-shadow(0 2px 6px rgba(60,120,60,0.2))" }} />

              {/* Top-left sheen */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "linear-gradient(130deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 35%, transparent 55%)" }} />
              {/* Bottom deep shadow */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-full pointer-events-none"
                style={{ height: "38%", background: "linear-gradient(to bottom, transparent, rgba(60,120,60,0.1))" }} />
              {/* Inner rim glow */}
              <div className="absolute inset-2 rounded-full pointer-events-none"
                style={{ border: "1px solid rgba(255,255,255,0.6)" }} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.75 }}
            className="lux-gold-text font-black leading-none mb-3"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)", letterSpacing: "-0.02em" }}>
            طبيعة نقية
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="font-bold mb-6"
            style={{ fontSize: "clamp(1rem,3vw,1.6rem)", color: "#5a8a5a", letterSpacing: "0.01em" }}>
            جمال طبيعي · أعشاب أصيلة · زيوت نقية
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.7 }}
            style={{ color: "rgba(45,80,45,0.55)", fontSize: "1.05rem", maxWidth: 460, lineHeight: 1.9, marginBottom: "2.5rem" }}>
            نجلب لك أفضل ما أنتجته الطبيعة — من أعشاب مختارة بعناية وزيوت معصورة بارداً إلى كريمات طبيعية خالصة، لحياة أكثر صحةً وجمالاً.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                className="px-9 py-4 rounded-2xl font-black text-base"
                style={{ background: "linear-gradient(135deg,#3d7a3d 0%,#5aaa5a 60%,#4a9a4a 100%)",
                  color: "#fff", boxShadow: "0 8px 32px rgba(74,138,74,0.35), 0 2px 0 rgba(255,255,255,0.2) inset" }}>
                تصفح المنتجات ←
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                className="px-9 py-4 rounded-2xl font-bold text-base"
                style={{ background: "rgba(90,154,90,0.08)", color: "#3d6a3d",
                  border: "1.5px solid rgba(90,154,90,0.3)", backdropFilter: "blur(10px)" }}>
                اكتشف مجموعتنا
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats — glass cards with shimmer + 3D hover */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex gap-3 flex-wrap justify-center">
            {[
              { icon: "✦", num: "100%", label: "نقاء مضمون" },
              { icon: "🇩🇿", num: "48", label: "ولاية جزائر" },
              { icon: "⚡", num: "24h", label: "دعم مستمر" },
            ].map(({ icon, num, label }, i) => (
              <div key={i}
                className="lux-glass-shimmer lux-card-3d flex flex-col items-center px-5 py-4 rounded-2xl cursor-default"
                style={{ "--delay": `${i * 1.5}s`, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(90,154,90,0.2)",
                  boxShadow: "0 4px 20px rgba(90,154,90,0.1)", minWidth: 90 } as React.CSSProperties}>
                <span className="text-xl mb-1">{icon}</span>
                <span className="font-black text-lg" style={{ color: "#3a7a3a" }}>{num}</span>
                <span className="text-xs" style={{ color: "rgba(45,80,45,0.5)" }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Wave bottom */}
        <WaveBottom fill="#0a2e18" />

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "rgba(45,80,45,0.4)" }}>اسحب للأسفل</span>
          <div className="w-6 h-9 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(90,154,90,0.3)" }}>
            <motion.div className="w-1.5 h-2 rounded-full" style={{ background: "rgba(90,154,90,0.6)" }}
              animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          WATER DROP ON LEAF — Transition
      ══════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "620px" }}>
        <WaterDropLeafCanvas />
        <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom,#0a2e18,transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top,#0a2e18,transparent)" }} />
        <div className="relative z-20 flex flex-col items-center justify-center h-full py-24 px-6 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 rounded-full text-xs font-semibold"
              style={{ background: "rgba(15,74,34,0.55)", color: "#86efac",
                border: "1px solid rgba(134,239,172,0.25)", backdropFilter: "blur(14px)" }}>
              <Droplets className="w-3.5 h-3.5" />
              كل قطرة من الطبيعة — لك
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-black mb-5 leading-tight"
              style={{ fontSize: "clamp(2.2rem,6vw,4.5rem)",
                background: "linear-gradient(135deg,#fff 30%,#86efac 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 40px rgba(34,197,94,0.25))" }}>
              كل قطرة تحكي قصة&nbsp;<br />
              <span style={{ color: "#4ade80", WebkitTextFillColor: "#4ade80" }}>طبيعة</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="max-w-md text-base leading-loose mb-14" style={{ color: "rgba(220,255,230,0.55)" }}>
              نختار كل مكوّن بعناية من أجود المصادر الجزائرية الأصيلة، لنقدّم لك منتجات تحتفي بجمال الطبيعة وقوتها الشافية.
            </p>
          </FadeUp>
          <div className="flex flex-wrap gap-5 justify-center">
            {[
              { icon: Droplets, value: "100%", label: "طبيعي خالص", color: "#4ade80" },
              { icon: Shield,   value: "0",    label: "مواد كيميائية", color: "#d4af37" },
              { icon: Star,     value: "5★",   label: "تقييم العملاء", color: "#fb923c" },
              { icon: Truck,    value: "48",   label: "ولاية توصيل", color: "#60a5fa" },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.09 + 0.25, type: "spring", stiffness: 130 }}
                whileHover={{ y: -8, scale: 1.07 }}
                className="flex flex-col items-center gap-2.5 px-6 py-6 rounded-3xl cursor-default"
                style={{ background: "rgba(5,30,15,0.55)", border: `1px solid ${color}28`,
                  backdropFilter: "blur(20px)", boxShadow: `0 8px 32px rgba(0,0,0,0.35),0 0 0 1px ${color}10 inset`,
                  minWidth: 115 }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}35`, boxShadow: `0 0 20px ${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="font-black text-2xl" style={{ color }}>{value}</span>
                <span className="text-xs text-center" style={{ color: "rgba(200,240,210,0.45)" }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#0a2e18 0%,#0d3a1e 50%,#0a2e18 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <FadeUp><p className="font-semibold text-sm tracking-widest uppercase mb-3" style={{ color: "#4ade80" }}>لماذا تختارنا</p></FadeUp>
            <FadeUp delay={0.1}><h2 className="font-black text-white" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>جودة لا تقبل المساومة</h2></FadeUp>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Leaf,     title: "طبيعي 100%",  text: "منتجاتنا خالية تماماً من المواد الكيميائية الضارة، محضرة من أعشاب طبيعية مختارة بعناية فائقة.", color: "#4ade80", glow: "rgba(74,222,128,0.15)" },
              { icon: Droplets, title: "زيوت أصلية",  text: "خلاصات وزيوت نقية معصورة على البارد للحفاظ على كامل فوائدها العلاجية والطبيعية.",              color: "#d4af37", glow: "rgba(212,175,55,0.15)" },
              { icon: Heart,    title: "عناية فائقة", text: "نصنع كل منتج بحب وعناية لمنحك تجربة فريدة تجمع بين الصحة والجمال الطبيعي.",                    color: "#f87171", glow: "rgba(248,113,113,0.15)" },
            ].map(({ icon: Icon, title, text, color, glow }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lux-glass-shimmer lux-card-3d relative flex flex-col items-center text-center p-8 rounded-3xl cursor-default"
                style={{ "--delay": `${i * 2}s`, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)", boxShadow: `0 0 60px ${glow}` } as React.CSSProperties}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
                  style={{ background: `linear-gradient(to right,transparent,${color},transparent)` }} />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${color}18`, border: `1px solid ${color}30`, boxShadow: `0 0 30px ${glow}` }}>
                  <Icon className="w-8 h-8" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#f7fdf9" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ left: `${8+(i*9.2)%85}%`, top: `${10+(i*7.1)%80}%`,
                width: 3+(i%3), height: 3+(i%3),
                background: `radial-gradient(circle,${i%2===0?"#5a9a5a":"#8b7dba"},transparent)`, opacity: 0.12 }}
              animate={{ y: [-6,6,-6], opacity: [0.08,0.2,0.08] }}
              transition={{ duration: 5+(i%4)*2, delay: (i*0.5)%4, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-end justify-between mb-14">
            <div>
              <FadeUp>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div animate={{ rotate: [0,15,-15,0] }} transition={{ duration: 4, repeat: Infinity }}>
                    <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                  </motion.div>
                  <p className="text-[#1e5c38] font-semibold text-sm tracking-widest uppercase">منتجاتنا</p>
                </div>
              </FadeUp>
              <FadeUp delay={0.08}>
                <h2 className="font-black text-gray-900" style={{ fontSize: "clamp(1.8rem,4vw,3rem)" }}>المنتجات المميزة</h2>
              </FadeUp>
            </div>
            <FadeUp delay={0.12}>
              <Link href="/products">
                <motion.button whileHover={{ scale: 1.05, x: -3 }} whileTap={{ scale: 0.97 }}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold border hidden md:flex items-center gap-2"
                  style={{ borderColor: "rgba(30,92,56,0.3)", color: "#1e5c38" }}>
                  عرض الكل <ArrowLeft className="w-4 h-4" />
                </motion.button>
              </Link>
            </FadeUp>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-3xl h-72 overflow-hidden relative">
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(90deg,#f0f0f0 25%,#f8f8f8 50%,#f0f0f0 75%)",
                    backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite",
                  }} />
                </motion.div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {featured.map((product, i) => (
                <motion.div key={product.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, duration: 0.7, type: "spring", stiffness: 100, damping: 14 }}
                  whileHover={{ y: -10, scale: 1.02 }}>
                  <Link href={`/products/${product.id}`} className="group block h-full">
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-400 group-hover:shadow-2xl group-hover:shadow-green-100 relative">
                      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{ boxShadow: "inset 0 0 0 1.5px rgba(30,92,56,0.2)" }} />
                      <div className="aspect-square relative overflow-hidden bg-gray-50">
                        {product.imageUrl
                          ? <img src={product.imageUrl} alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <Leaf className="w-12 h-12 text-gray-200" />
                            </div>}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-white text-gray-800 font-bold px-3 py-1 rounded-full text-xs">نفذت الكمية</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <div className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                            style={{ background: "rgba(212,175,55,0.95)", color: "#041a0c" }}>
                            <Star className="w-2.5 h-2.5 fill-current" /> طبيعي
                          </div>
                        </div>
                        {product.inStock && (
                          <motion.div animate={{ scale: [1,1.3,1], opacity: [0.8,1,0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/60" />
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#1e5c38] transition-colors duration-300">{product.name}</h3>
                        <p className="text-gray-400 text-xs line-clamp-1 mb-auto">{product.description}</p>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
                          <span className="text-[#1e5c38] font-black text-lg" dir="ltr">
                            {product.price}<span className="text-xs text-gray-400 font-normal mr-1">د.ج</span>
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] group-hover:bg-[#1e5c38] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-200">
                            <ShoppingBag className="w-4 h-4 text-[#1e5c38] group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Leaf className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">لا توجد منتجات حالياً</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="flex justify-center mt-10 md:hidden">
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-2xl font-bold text-sm border"
                style={{ borderColor: "rgba(30,92,56,0.3)", color: "#1e5c38" }}>
                عرض جميع المنتجات ←
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg,#020d06 0%,#062314 50%,#041a0c 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%,rgba(34,197,94,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(212,175,55,0.06) 0%,transparent 50%)"
          }} />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
              ابدأ رحلتك الطبيعية <span style={{ color: "#4ade80" }}>اليوم</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto 2.5rem" }}>
              اكتشف مجموعتنا الفريدة من المنتجات الطبيعية المختارة بعناية من أرض الجزائر الطيبة.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl font-black text-base"
                style={{ background: "linear-gradient(135deg,#d4af37 0%,#e8c84a 50%,#c49b2a 100%)",
                  color: "#041a0c", boxShadow: "0 8px 40px rgba(212,175,55,0.35)" }}>
                تسوق الآن ←
              </motion.button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
