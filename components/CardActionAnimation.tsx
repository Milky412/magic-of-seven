"use client";

import { Box, HStack } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import MagicCard from "@/components/MagicCard";
import type { Card, LastActionKind } from "@/game/types";

const HIDDEN_CARD: Card = { id: "animation-hidden", number: 1, magic: "truth" };

const CSS = `
@keyframes v40-summon{0%{opacity:0;transform:translateY(85px) scale(.55) rotate(-8deg);filter:blur(4px) brightness(.5)}55%{opacity:1;transform:translateY(-12px) scale(1.08) rotate(2deg);filter:blur(0) brightness(1.9)}100%{transform:translateY(0) scale(1) rotate(0);filter:brightness(1)}}
@keyframes v40-burst{0%{opacity:.9;transform:scale(.12)}100%{opacity:0;transform:scale(1.5)}}
@keyframes v40-particle{0%{opacity:0;transform:translate(0,0) scale(.2)}18%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1)}}
@keyframes v40-caster{0%{opacity:0;transform:translateX(-105px) rotate(-14deg) scale(.62)}70%{opacity:1;transform:translateX(8px) rotate(3deg) scale(1.05)}100%{transform:none}}
@keyframes v40-beam{0%{opacity:0;transform:scaleX(.02)}25%{opacity:1}75%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1.08)}}
@keyframes v40-hit{0%,43%{transform:none;filter:brightness(1);opacity:1}51%{transform:translate(9px,-3px) rotate(4deg);filter:brightness(2.8)}58%{transform:translate(-10px,5px) rotate(-5deg)}67%{transform:translate(6px,-2px) rotate(3deg) scale(.94)}100%{transform:translate(62px,25px) rotate(20deg) scale(.62);opacity:.08;filter:blur(2px) brightness(.5)}}
@keyframes v40-shard{0%,49%{opacity:0;transform:translate(0,0) rotate(0) scale(.2)}55%{opacity:1}100%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--sr)) scale(1)}}
@keyframes v40-stack{0%{opacity:0;transform:translate(110px,-70px) rotate(20deg) scale(.55)}70%{opacity:1;transform:translate(9px,-8px) rotate(3deg) scale(1.05)}100%{transform:translate(5px,-5px) rotate(1deg) scale(.94)}}
@keyframes v40-castcard{0%{opacity:0;transform:translate(125px,-80px) rotate(22deg) scale(.5);filter:brightness(.5)}55%{opacity:1;transform:translate(5px,-20px) rotate(-2deg) scale(1.12);filter:brightness(2)}100%{opacity:.15;transform:translate(3px,-8px) scale(.86);filter:brightness(1)}}
@keyframes v40-backland{0%,48%{opacity:0;transform:translateY(-70px) rotate(10deg) scale(.72)}78%{opacity:1;transform:translateY(5px) rotate(-2deg) scale(1.04)}100%{opacity:1;transform:none}}
@keyframes v40-shield{0%{opacity:0;transform:scale(.15) rotateX(70deg)}45%{opacity:.9}75%{transform:scale(1.05) rotateX(5deg);opacity:.88}100%{transform:scale(1) rotateX(0);opacity:.78}}
@keyframes v40-sweep{0%{opacity:0;transform:translateY(70px) scaleX(.3)}25%{opacity:.9}100%{opacity:0;transform:translateY(-78px) scaleX(1.1)}}
@keyframes v40-wardhit{0%{opacity:0;transform:translateX(80px) scaleX(.1)}35%{opacity:1}72%{opacity:1;transform:translateX(4px) scaleX(1)}100%{opacity:0;transform:translateX(-3px) scaleX(.45)}}
@keyframes v40-wardflash{0%,52%{opacity:0;transform:scale(.3)}64%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.8)}}
@keyframes v40-doublecore{0%{opacity:0;transform:scale(.2) rotate(0)}35%{opacity:.9}100%{opacity:0;transform:scale(1.5) rotate(150deg)}}
@keyframes v40-betrayturn{0%{transform:perspective(600px) rotateY(0);filter:hue-rotate(0)}45%{transform:perspective(600px) rotateY(90deg) scale(1.05);filter:hue-rotate(70deg) brightness(1.4)}100%{transform:perspective(600px) rotateY(180deg);filter:hue-rotate(150deg) brightness(.72)}}
@keyframes v40-slash{0%{opacity:0;transform:rotate(var(--r)) scaleX(.05)}35%{opacity:1}100%{opacity:0;transform:rotate(var(--r)) scaleX(1.15)}}
@keyframes v41-moratorium-fade{0%{opacity:1;transform:scale(1);filter:brightness(1) drop-shadow(0 0 0 rgba(196,172,255,0))}35%{opacity:1;transform:scale(1.06);filter:brightness(1.8) drop-shadow(0 0 18px rgba(196,172,255,.8))}68%{opacity:.72;transform:scale(1.03);filter:brightness(2.6) blur(.3px) drop-shadow(0 0 32px rgba(196,172,255,.95))}100%{opacity:0;transform:scale(.92);filter:brightness(3.2) blur(5px) drop-shadow(0 0 44px rgba(196,172,255,1))}}
@keyframes v41-moratorium-aura{0%{opacity:0;transform:scale(.55)}35%{opacity:.9;transform:scale(.92)}100%{opacity:0;transform:scale(1.45)}}
@keyframes v41-amp-line{0%{opacity:0;transform:scaleY(.2) translateY(18px)}35%{opacity:.9}100%{opacity:0;transform:scaleY(1.4) translateY(-28px)}}
@keyframes v40-draw{0%,50%{opacity:0;transform:translateY(80px) scale(.45) rotate(10deg)}80%{opacity:1;transform:translateY(-8px) scale(1.08) rotate(-2deg)}100%{opacity:1;transform:none}}
@keyframes v40-revive{0%{opacity:0;transform:translateY(85px) scale(.45);filter:grayscale(1) brightness(.5)}60%{opacity:1;transform:translateY(-12px) scale(1.1);filter:grayscale(0) brightness(1.8)}100%{transform:none;filter:none}}
@keyframes v40-wisp{0%{opacity:0;transform:translateY(55px) scale(.4)}30%{opacity:.85}100%{opacity:0;transform:translate(var(--wx),-75px) scale(1)}}
@keyframes v40-truthflip{0%,38%{transform:rotateY(0)}70%,100%{transform:rotateY(180deg)}}
@keyframes v40-scan{0%{opacity:0;transform:translateY(62px)}25%{opacity:1}100%{opacity:0;transform:translateY(-62px)}}
@keyframes v40-eye{0%{opacity:0;transform:scaleX(.2)}40%{opacity:.9;transform:scaleX(1)}100%{opacity:.25;transform:scaleX(1)}}
`;

export default function CardActionAnimation({ card, hidden = false, actionKind, targetCard = null }: {
  card: Card;
  hidden?: boolean;
  actionKind?: LastActionKind;
  targetCard?: Card | null;
}) {
  const kind = actionKind ?? (hidden ? "stack" : "summon");
  return (
    <Box
      position="relative"
      w={{ base: "300px", md: "560px" }}
      h={{ base: "205px", md: "230px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      flexShrink={0}
    >
      <style>{CSS}</style>
      {kind === "summon" && <Summon card={card} />}
      {kind === "draft" && <Box animation="v40-summon .75s ease-out both"><AnimatedCard card={card} hidden={hidden} /></Box>}
      {kind === "stack" && hidden && <HiddenStack targetCard={targetCard} />}
      {kind === "stack" && !hidden && <VisibleStack card={card} targetCard={targetCard} />}
      {kind === "destroy" && <Destroy card={card} targetCard={targetCard} />}
      {kind === "moratorium" && <Moratorium card={card} />}
      {kind === "revive" && <Revive card={card} targetCard={targetCard} />}
      {kind === "truth" && <Truth card={card} targetCard={targetCard} />}
    </Box>
  );
}

function Summon({card}:{card:Card}) {
  const n = Math.max(1, Math.min(7, card.number));
  return <Box position="relative" display="flex" alignItems="center" justifyContent="center">
    {[0,1].map(i=><Box key={i} position="absolute" w={`${118+i*26}px`} h={`${118+i*26}px`} border="1px solid rgba(242,203,113,.55)" borderRadius="999px" animation={`v40-burst ${.75+i*.14}s ${i*.08}s ease-out both`} />)}
    <Box animation={`v40-summon ${Math.max(.55,.92-n*.035)}s cubic-bezier(.18,.9,.22,1.1) both`} zIndex="2"><AnimatedCard card={card} /></Box>
    {Array.from({length:8+n}).map((_,i)=>{const a=i/(8+n)*Math.PI*2;const d=55+(i%4)*12;return <Box key={i} position="absolute" left="50%" top="50%" w="5px" h="5px" borderRadius="999px" bg="#F3D58D" boxShadow="0 0 10px rgba(243,213,141,.8)" style={{"--x":`${Math.cos(a)*d}px`,"--y":`${Math.sin(a)*d}px`,animation:`v40-particle .75s ${.08+(i%4)*.04}s ease-out both`} as CSSProperties}/>})}
  </Box>;
}

function HiddenStack({targetCard}:{targetCard:Card|null}) {
  return <HStack gap={{base:"4",md:"10"}} align="center">
    {targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}
    <Box animation="v40-stack .95s cubic-bezier(.18,.9,.25,1.15) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
  </HStack>;
}

function VisibleStack({card,targetCard}:{card:Card;targetCard:Card|null}) {
  if(card.magic==="guard") return <Guard card={card} targetCard={targetCard}/>;
  if(card.magic==="double") return <Double card={card} targetCard={targetCard}/>;
  if(card.magic==="betray") return <Betray card={card} targetCard={targetCard}/>;
  return <HiddenStack targetCard={targetCard}/>;
}

function SceneTarget({targetCard}:{targetCard:Card|null}) {
  return <Box position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} zIndex="3">{targetCard?<AnimatedCard card={targetCard} />:<AnimatedCard card={HIDDEN_CARD} hidden />}</Box>;
}

function AnimatedCard({card, hidden = false}:{card:Card; hidden?:boolean}) {
  return (
    <Box
      w={{ base: "122px", md: "136px" }}
      h={{ base: "183px", md: "204px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Box
        transform={{ base: "scale(1.32)", md: "scale(1.48)" }}
        transformOrigin="center center"
      >
        <MagicCard card={card} hidden={hidden} size="small" />
      </Box>
    </Box>
  );
}

function CastAndBack({card}:{card:Card}) {
  return <>
    <Box position="absolute" left="72%" top="43%" style={{ translate: "-50% -50%" }} zIndex="6" animation="v40-castcard 1.05s cubic-bezier(.15,.9,.22,1.12) both"><AnimatedCard card={card}/></Box>
    <Box position="absolute" left="72%" top="50%" style={{ translate: "-50% -50%" }} zIndex="5" animation="v40-backland 1.16s .18s cubic-bezier(.15,.9,.22,1.12) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
  </>;
}

function Guard({card,targetCard}:{card:Card;targetCard:Card|null}) {
  return <Box position="relative" w="100%" h="100%">
    <SceneTarget targetCard={targetCard}/><CastAndBack card={card}/>
    <Box position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} w={{base:"132px",md:"154px"}} h={{base:"170px",md:"190px"}} border="3px solid rgba(116,205,255,.86)" borderRadius="52% 52% 48% 48% / 40% 40% 62% 62%" bg="radial-gradient(ellipse at 50% 34%,rgba(194,235,255,.18),rgba(55,137,199,.05) 64%,transparent 73%)" boxShadow="0 0 30px rgba(93,188,246,.5), inset 0 0 35px rgba(112,207,255,.2)" animation="v40-shield 1.05s .16s cubic-bezier(.18,.9,.22,1.1) both" zIndex="4"/>
    <Box position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} w={{base:"112px",md:"132px"}} h="6px" bg="linear-gradient(90deg,transparent,#DDF6FF,transparent)" boxShadow="0 0 18px rgba(174,229,255,.9)" animation="v40-sweep 1.05s .28s ease-out both" zIndex="5"/>
    <Box position="absolute" right="2%" top="calc(50% - 3.5px)" w={{base:"118px",md:"180px"}} h="7px" transformOrigin="right center" bg="linear-gradient(90deg,transparent,#FFB45A,#FFF4C0)" boxShadow="0 0 18px rgba(255,174,82,.85)" animation="v40-wardhit 1.15s .35s ease-out both" zIndex="2"/>
    <Box position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} w="82px" h="82px" border="3px solid rgba(214,244,255,.82)" borderRadius="999px" boxShadow="0 0 25px rgba(147,220,255,.8)" animation="v40-wardflash .72s .72s ease-out both" zIndex="7"/>
  </Box>;
}

function Double({card,targetCard}:{card:Card;targetCard:Card|null}) {
  return <Box position="relative" w="100%" h="100%">
    <SceneTarget targetCard={targetCard}/><CastAndBack card={card}/>
    {[0,1,2].map(i=><Box key={i} position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} w={`${138+i*18}px`} h={`${138+i*18}px`} border={`${i===0?3:1}px solid rgba(255,211,99,${.72-i*.14})`} borderRadius="999px" boxShadow="0 0 30px rgba(255,196,62,.34)" animation={`v40-doublecore ${.92+i*.12}s ${.2+i*.06}s ease-out both`} zIndex="2"/>) }
    {[-34,-12,12,34].map((x,i)=><Box key={x} position="absolute" left={`calc(36% + ${x}px)`} top="50%" w="4px" h="112px" bg="linear-gradient(180deg,transparent,#FFE69B,transparent)" boxShadow="0 0 16px rgba(255,222,130,.7)" style={{ translate: "-50% -50%", animation:`v41-amp-line .78s ${.28+i*.06}s ease-out both` }} zIndex="4"/>)}
  </Box>;
}

function Betray({card,targetCard}:{card:Card;targetCard:Card|null}) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} zIndex="3" animation="v40-betrayturn 1.22s .12s cubic-bezier(.2,.7,.2,1) both">{targetCard?<AnimatedCard card={targetCard} />:<AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    <CastAndBack card={card}/>
    {[-22,22].map((r,i)=><Box key={r} position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%", "--r": `${r}deg`, animation: `v40-slash .85s ${.34+i*.16}s ease-out both` } as CSSProperties} w={{base:"160px",md:"210px"}} h="6px" bg="linear-gradient(90deg,transparent,#A55BD7,#F0B7FF,transparent)" boxShadow="0 0 18px rgba(165,91,215,.9)" zIndex="7"/>)}
  </Box>;
}

function Destroy({card,targetCard}:{card:Card;targetCard:Card|null}) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="22%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-caster .72s cubic-bezier(.16,.9,.22,1.18) both" zIndex="4"><AnimatedCard card={card}/></Box>
    <Box position="absolute" left="35%" right="34%" top="calc(50% - 3px)" h="6px" transformOrigin="left center" bg="linear-gradient(90deg,rgba(255,220,150,0),#F36C3D 38%,#FFF2BE 90%)" boxShadow="0 0 24px rgba(243,108,61,.9),0 0 42px rgba(255,225,155,.45)" animation="v40-beam .75s .3s ease-out both" zIndex="2"/>
    <Box position="absolute" left="78%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-hit 1.28s .18s cubic-bezier(.2,.75,.22,1) both" zIndex="3">{targetCard?<AnimatedCard card={targetCard} />:<AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    {Array.from({length:9}).map((_,i)=>{const a=(i/9)*Math.PI*2;const d=52+(i%3)*13;return <Box key={i} position="absolute" left="78%" top="50%" w={i%2?"7px":"10px"} h={i%2?"4px":"6px"} bg={i%2?"#FFC16A":"#F2E6CF"} clipPath="polygon(0 0,100% 20%,72% 100%,18% 78%)" style={{ translate: "-50% -50%", "--sx":`${Math.cos(a)*d}px`,"--sy":`${Math.sin(a)*d}px`,"--sr":`${80+i*45}deg`,animation:`v40-shard .72s ${.56+(i%3)*.03}s ease-out both`} as CSSProperties} zIndex="6"/>})}
  </Box>;
}

function Moratorium({card}:{card:Card}) {
  return <HStack gap={{base:"8",md:"14"}} align="center">
    <Box position="relative">
      {[0,1].map(i=><Box key={i} position="absolute" inset={-12-i*12} border={`${i===0?2:1}px solid rgba(186,159,240,${.62-i*.12})`} borderRadius="18px" boxShadow="0 0 24px rgba(177,145,235,.36)" animation={`v41-moratorium-aura ${.85+i*.14}s ${.08+i*.08}s ease-out both`}/>) }
      <Box animation="v41-moratorium-fade 1.15s ease-out both"><AnimatedCard card={card}/></Box>
    </Box>
    <Box position="relative">
      <Box animation="v40-draw 1.2s .5s cubic-bezier(.17,.9,.24,1.14) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
      <Box position="absolute" inset="-14px" border="1px solid rgba(180,153,236,.5)" borderRadius="18px" animation="v41-moratorium-aura 1.0s .42s ease-out both"/>
    </Box>
  </HStack>;
}

function Revive({card,targetCard}:{card:Card;targetCard:Card|null}) {
  return <HStack gap={{base:"6",md:"12"}} align="center">
    <Box opacity=".72"><AnimatedCard card={card}/></Box>
    <Box position="relative">
      {Array.from({length:6}).map((_,i)=><Box key={i} position="absolute" left={`${20+i*12}%`} bottom="10%" w="5px" h="36px" borderRadius="999px" bg="linear-gradient(180deg,transparent,#EED88A,transparent)" style={{"--wx":`${(i-2.5)*8}px`,animation:`v40-wisp ${.9+(i%3)*.12}s ${i*.06}s ease-out both`} as CSSProperties}/>) }
      <Box animation="v40-revive 1.28s cubic-bezier(.18,.9,.22,1.2) both">{targetCard?<AnimatedCard card={targetCard} />:<AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    </Box>
  </HStack>;
}

function Truth({card,targetCard}:{card:Card;targetCard:Card|null}) {
  return <HStack gap={{base:"6",md:"12"}} align="center">
    <AnimatedCard card={card}/>
    <Box position="relative" w={{base:"140px",md:"155px"}} h={{base:"190px",md:"210px"}} display="flex" alignItems="center" justifyContent="center" style={{perspective:"850px"}}>
      <Box position="absolute" w="145px" h="70px" border="2px solid rgba(245,239,205,.62)" borderRadius="52%" boxShadow="0 0 25px rgba(245,239,205,.25)" animation="v40-eye 1.25s ease-out both"/>
      <Box position="absolute" w="130px" h="5px" bg="linear-gradient(90deg,transparent,#FFF8D5,transparent)" boxShadow="0 0 16px rgba(255,250,221,.8)" animation="v40-scan 1.2s ease-in-out both"/>
      <Box position="relative" w={{base:"122px",md:"136px"}} h={{base:"183px",md:"204px"}} transformStyle="preserve-3d" animation="v40-truthflip 1.35s cubic-bezier(.25,.65,.2,1) both">
        <Box position="absolute" inset="0" backfaceVisibility="hidden"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
        <Box position="absolute" inset="0" transform="rotateY(180deg)" backfaceVisibility="hidden">{targetCard?<AnimatedCard card={targetCard} />:<AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
      </Box>
    </Box>
  </HStack>;
}
