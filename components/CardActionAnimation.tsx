"use client";

import { Box, HStack } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import MagicCard from "@/components/MagicCard";
import type { Card, LastActionEffectSnapshot, LastActionKind } from "@/game/types";

const HIDDEN_CARD: Card = { id: "animation-hidden", number: 1, magic: "truth" };
const GUARD_TUTORIAL_ATTACKER: Card = { id: "animation-guard-destroy", number: 2, magic: "destroy" };

export type CardAnimationVariant = "guard-showcase" | "guard-tutorial-sequence" | null;

const CSS = `


@keyframes v47-holy-pillar{0%{opacity:0;transform:translateY(30px) scaleY(.15)}32%{opacity:.9}100%{opacity:0;transform:translateY(-36px) scaleY(1.35)}}
@keyframes v47-holy-cross{0%{opacity:0;transform:scale(.25) rotate(-12deg)}45%{opacity:1;transform:scale(1.08) rotate(0)}100%{opacity:.58;transform:scale(1) rotate(0)}}
@keyframes v47-holy-orbit{0%{opacity:0;transform:rotate(0deg) scale(.55)}35%{opacity:.95}100%{opacity:0;transform:rotate(210deg) scale(1.38)}}
@keyframes v47-holy-feather{0%{opacity:0;transform:translate(0,0) rotate(var(--fr)) scale(.3)}25%{opacity:.95}100%{opacity:0;transform:translate(var(--fx),var(--fy)) rotate(calc(var(--fr) + 90deg)) scale(1.05)}}
@keyframes v47-holy-impact{0%,48%{opacity:0;transform:scale(.25)}60%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.75)}}
@keyframes v47-holy-flash{0%,48%{opacity:0}58%{opacity:.95}100%{opacity:0}}
@keyframes v49-guard-slide{0%{opacity:0;transform:translateX(76px) scale(.82);filter:brightness(.7)}58%{opacity:1;transform:translateX(0) scale(1.04);filter:brightness(1.8)}100%{opacity:1;transform:translateX(0) scale(1);filter:brightness(1)}}
@keyframes v49-guard-back{0%,50%{opacity:0;transform:scale(.9)}75%{opacity:1;transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
@keyframes v49-halo-open{0%{opacity:0;transform:scale(.15)}34%{opacity:1;transform:scale(.95)}100%{opacity:.2;transform:scale(1.45)}}
@keyframes v49-sigil-spin{0%{opacity:0;transform:rotate(-35deg) scale(.4)}42%{opacity:.95;transform:rotate(0deg) scale(1.03)}100%{opacity:.45;transform:rotate(35deg) scale(1.12)}}
@keyframes v49-wing-left{0%{opacity:0;transform:translate(18px,10px) rotate(-18deg) scale(.3)}45%{opacity:.9}100%{opacity:0;transform:translate(-42px,-24px) rotate(-48deg) scale(1)}}
@keyframes v49-wing-right{0%{opacity:0;transform:translate(-18px,10px) rotate(18deg) scale(.3)}45%{opacity:.9}100%{opacity:0;transform:translate(42px,-24px) rotate(48deg) scale(1)}}
@keyframes v46-scene-in{0%{opacity:0;transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes v46-scene-out{0%,72%{opacity:1}100%{opacity:0}}
@keyframes v40-summon{0%{opacity:0;transform:translateY(85px) scale(.55) rotate(-8deg);filter:blur(4px) brightness(.5)}55%{opacity:1;transform:translateY(-12px) scale(1.08) rotate(2deg);filter:blur(0) brightness(1.9)}100%{transform:translateY(0) scale(1) rotate(0);filter:brightness(1)}}
@keyframes v40-burst{0%{opacity:.9;transform:scale(.12)}100%{opacity:0;transform:scale(1.5)}}
@keyframes v40-particle{0%{opacity:0;transform:translate(0,0) scale(.2)}18%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1)}}
@keyframes v40-caster{0%{opacity:0;transform:translateX(-105px) rotate(-14deg) scale(.62)}70%{opacity:1;transform:translateX(8px) rotate(3deg) scale(1.05)}100%{transform:none}}
@keyframes v40-hit{0%,38%{transform:none;filter:brightness(1);opacity:1}47%{transform:translate(10px,-4px) rotate(5deg);filter:brightness(3.2)}54%{transform:translate(-12px,6px) rotate(-6deg)}62%{transform:translate(8px,-3px) rotate(4deg) scale(.96)}72%{transform:translate(-6px,3px) rotate(-3deg) scale(.9);opacity:.92}100%{transform:translate(48px,24px) rotate(18deg) scale(.58);opacity:.04;filter:blur(3px) brightness(.45)}}
@keyframes v44-explosion-core{0%,34%{opacity:0;transform:scale(.08)}45%{opacity:1;transform:scale(.55)}62%{opacity:.95;transform:scale(1.15)}100%{opacity:0;transform:scale(1.75)}}
@keyframes v44-explosion-ring{0%,38%{opacity:0;transform:scale(.2);border-width:6px}48%{opacity:.95}100%{opacity:0;transform:scale(1.9);border-width:1px}}
@keyframes v44-smoke{0%,48%{opacity:0;transform:translate(0,0) scale(.35)}58%{opacity:.55}100%{opacity:0;transform:translate(var(--mx),var(--my)) scale(1.3)}}
@keyframes v40-shard{0%,49%{opacity:0;transform:translate(0,0) rotate(0) scale(.2)}55%{opacity:1}100%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--sr)) scale(1)}}
@keyframes v40-stack{0%{opacity:0;transform:translate(110px,-70px) rotate(20deg) scale(.55)}70%{opacity:1;transform:translate(9px,-8px) rotate(3deg) scale(1.05)}100%{transform:translate(5px,-5px) rotate(1deg) scale(.94)}}
@keyframes v40-castcard{0%{opacity:0;transform:translate(125px,-80px) rotate(22deg) scale(.5);filter:brightness(.5)}55%{opacity:1;transform:translate(5px,-20px) rotate(-2deg) scale(1.12);filter:brightness(2)}100%{opacity:.15;transform:translate(3px,-8px) scale(.86);filter:brightness(1)}}
@keyframes v40-backland{0%,48%{opacity:0;transform:translateY(-70px) rotate(10deg) scale(.72)}78%{opacity:1;transform:translateY(5px) rotate(-2deg) scale(1.04)}100%{opacity:1;transform:none}}
@keyframes v40-shield{0%{opacity:0;transform:scale(.15) rotateX(70deg)}45%{opacity:.9}75%{transform:scale(1.05) rotateX(5deg);opacity:.88}100%{transform:scale(1) rotateX(0);opacity:.78}}
@keyframes v45-shield-hum{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.85;transform:scale(1.04)}}
@keyframes v45-guard-rune{0%{opacity:0;transform:scale(.2) rotate(0deg)}35%{opacity:.8}100%{opacity:0;transform:scale(1.35) rotate(110deg)}}
@keyframes v45-guard-wave{0%{opacity:0;transform:scale(.18)}28%{opacity:.95}100%{opacity:0;transform:scale(1.48)}}
@keyframes v45-impact-travel{0%,20%{opacity:0;transform:translateX(0) scaleX(.08)}38%{opacity:1}100%{opacity:0;transform:translateX(var(--travel)) scaleX(1)}}
@keyframes v45-guard-stop{0%,52%{opacity:0;transform:scale(.25)}62%{opacity:1;transform:scale(1.05)}100%{opacity:0;transform:scale(1.6)}}
@keyframes v45-card-jolt{0%,50%,100%{transform:translate(-50%,-50%) scale(1)}58%{transform:translate(calc(-50% - 2px),calc(-50% - 4px)) scale(1.01)}66%{transform:translate(calc(-50% + 2px),calc(-50% + 2px)) scale(1)}}
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
@keyframes v48-card-slot{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}
@keyframes v48-card-break{0%,30%{opacity:1;transform:scale(1) rotate(0deg);filter:brightness(1)}48%{filter:brightness(2.2)}100%{opacity:0;transform:scale(.56) rotate(13deg) translate(42px,20px);filter:blur(3px) brightness(.6)}}
@keyframes v71-guard-break{0%,18%{opacity:1;transform:scale(1) rotate(0deg);filter:brightness(1)}38%{opacity:1;transform:scale(1.06) rotate(-2deg);filter:brightness(2.5)}100%{opacity:0;transform:scale(.46) rotate(16deg) translate(48px,24px);filter:blur(4px) brightness(.65)}}
@keyframes v48-card-flip{0%{transform:rotateY(0deg)}100%{transform:rotateY(180deg)}}
@keyframes v48-base-destroy{0%,70%{opacity:1;transform:translate(-50%,-50%) scale(1)}78%{filter:brightness(2.6)}100%{opacity:.02;transform:translate(-50%,-50%) scale(.62) rotate(16deg);filter:blur(3px)}}
@keyframes v48-reveal-enter{0%{opacity:0;transform:translateY(20px) scale(.82)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes v48-reveal-hold{0%,100%{opacity:1}}
@keyframes v48-spark-pop{0%{opacity:0;transform:scale(.1)}42%{opacity:1}100%{opacity:0;transform:scale(1.45)}}
@keyframes v68-preview-hide{from{opacity:1}to{opacity:0}}
@keyframes v50-truth-stack{0%{opacity:0;transform:translateY(16px) scale(.88)}100%{opacity:.58;transform:translateY(0) scale(1)}}
@keyframes v50-truth-flare{0%{opacity:0;transform:scale(.18)}38%{opacity:1;transform:scale(.96)}100%{opacity:0;transform:scale(1.6)}}
@keyframes v50-truth-ray{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--tr)) scaleY(.18)}32%{opacity:.95}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--tr)) scaleY(1.12)}}
`;

type Props = {
  card: Card;
  hidden?: boolean;
  actionKind?: LastActionKind;
  targetCard?: Card | null;
  targetEffects?: LastActionEffectSnapshot[];
  actionText?: string;
  animationVariant?: CardAnimationVariant;
};

export default function CardActionAnimation({
  card,
  hidden = false,
  actionKind,
  targetCard = null,
  targetEffects = [],
  actionText,
  animationVariant = null,
}: Props) {
  const kind = actionKind ?? (hidden ? "stack" : "summon");
  const blockedByGuard = kind === "destroy" && /守護.*止め|止められました/.test(actionText ?? "");
  const isWideTruth = kind === "truth" && targetEffects.length > 1;
  const isWideDestroy = kind === "destroy" && targetEffects.length > 0;
  const frameWidth = isWideTruth
    ? { base: "390px", md: "940px" }
    : isWideDestroy
      ? { base: "340px", md: "700px" }
      : { base: "300px", md: "560px" };
  const frameHeight = isWideTruth
    ? { base: "240px", md: "290px" }
    : isWideDestroy
      ? { base: "215px", md: "250px" }
      : { base: "205px", md: "230px" };

  return (
    <Box
      position="relative"
      w={frameWidth}
      h={frameHeight}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      flexShrink={0}
    >
      <style>{CSS}</style>
      {animationVariant === "guard-showcase" ? (
        <GuardShowcase card={card} targetCard={targetCard} />
      ) : animationVariant === "guard-tutorial-sequence" ? (
        <GuardTutorialSequence card={card} targetCard={targetCard} />
      ) : (
        <>
          {kind === "summon" && <Summon card={card} />}
          {kind === "draft" && <Box animation="v40-summon .75s ease-out both"><AnimatedCard card={card} hidden={hidden} /></Box>}
          {kind === "stack" && hidden && <HiddenStack targetCard={targetCard} />}
          {kind === "stack" && !hidden && <VisibleStack card={card} targetCard={targetCard} />}
          {kind === "destroy" && targetEffects.length > 0 && <DestroyStackSequence card={card} targetCard={targetCard} targetEffects={targetEffects} />}
          {kind === "destroy" && targetEffects.length === 0 && blockedByGuard && <DestroyBlocked card={card} targetCard={targetCard} />}
          {kind === "destroy" && targetEffects.length === 0 && !blockedByGuard && <Destroy card={card} targetCard={targetCard} />}
          {kind === "moratorium" && <Moratorium card={card} />}
          {kind === "revive" && <Revive card={card} targetCard={targetCard} />}
          {kind === "truth" && targetEffects.length > 0 && <TruthMultiple card={card} targetCard={targetCard} targetEffects={targetEffects} />}
          {kind === "truth" && targetEffects.length === 0 && <Truth card={card} targetCard={targetCard} />}
        </>
      )}
    </Box>
  );
}

function Summon({ card }: { card: Card }) {
  const n = Math.max(1, Math.min(7, card.number));
  return <Box position="relative" display="flex" alignItems="center" justifyContent="center">
    {[0, 1].map(i => <Box key={i} position="absolute" w={`${118 + i * 26}px`} h={`${118 + i * 26}px`} border="1px solid rgba(242,203,113,.55)" borderRadius="999px" animation={`v40-burst ${.75 + i * .14}s ${i * .08}s ease-out both`} />)}
    <Box animation={`v40-summon ${Math.max(.55, .92 - n * .035)}s cubic-bezier(.18,.9,.22,1.1) both`} zIndex="2"><AnimatedCard card={card} /></Box>
    {Array.from({ length: 8 + n }).map((_, i) => {
      const a = i / (8 + n) * Math.PI * 2;
      const d = 55 + (i % 4) * 12;
      return <Box key={i} position="absolute" left="50%" top="50%" w="5px" h="5px" borderRadius="999px" bg="#F3D58D" boxShadow="0 0 10px rgba(243,213,141,.8)" style={{ "--x": `${Math.cos(a) * d}px`, "--y": `${Math.sin(a) * d}px`, animation: `v40-particle .75s ${.08 + (i % 4) * .04}s ease-out both` } as CSSProperties} />;
    })}
  </Box>;
}

function HiddenStack({ targetCard }: { targetCard: Card | null }) {
  return <HStack gap={{ base: "4", md: "10" }} align="center">
    {targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}
    <Box animation="v40-stack .95s cubic-bezier(.18,.9,.25,1.15) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
  </HStack>;
}

function VisibleStack({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  if (card.magic === "guard") return <GuardPlace card={card} targetCard={targetCard} />;
  if (card.magic === "double") return <Double card={card} targetCard={targetCard} />;
  if (card.magic === "betray") return <Betray card={card} targetCard={targetCard} />;
  return <HiddenStack targetCard={targetCard} />;
}

function SceneTarget({ targetCard, left = "36%" }: { targetCard: Card | null; left?: string }) {
  return <Box position="absolute" left={left} top="50%" style={{ translate: "-50% -50%" }} zIndex="3">{targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}</Box>;
}

function AnimatedCard({ card, hidden = false }: { card: Card; hidden?: boolean }) {
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

function CastAndBack({ card }: { card: Card }) {
  return <>
    <Box position="absolute" left="72%" top="50%" style={{ translate: "-50% -50%" }} zIndex="6" animation="v40-castcard 1.05s cubic-bezier(.15,.9,.22,1.12) both"><AnimatedCard card={card} /></Box>
    <Box position="absolute" left="72%" top="50%" style={{ translate: "-50% -50%" }} zIndex="5" animation="v40-backland 1.16s .18s cubic-bezier(.15,.9,.22,1.12) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
  </>;
}

function ShieldShell({ left = "36%", delay = 0.16 }: { left?: string; delay?: number }) {
  return <>
    <Box opacity="0" position="absolute" left={left} top="50%" style={{ translate: "-50% -50%" }} w={{ base: "190px", md: "228px" }} h={{ base: "218px", md: "244px" }} border="3px solid rgba(255,248,215,.95)" borderRadius="52% 52% 48% 48% / 40% 40% 62% 62%" bg="radial-gradient(ellipse at 50% 34%,rgba(255,255,244,.30),rgba(255,226,149,.15) 48%,rgba(96,151,215,.08) 72%,transparent 80%)" boxShadow="0 0 26px rgba(255,248,220,.95),0 0 62px rgba(255,221,126,.58),0 0 95px rgba(122,180,234,.22),inset 0 0 48px rgba(255,252,232,.28)" animation={`v40-shield 1.08s ${delay}s cubic-bezier(.18,.9,.22,1.1) both, v45-shield-hum 1.7s ${delay + .72}s ease-in-out`} zIndex="4" />
    <Box opacity="0" position="absolute" left={left} top="50%" style={{ translate: "-50% -50%" }} w={{base:"218px",md:"262px"}} h={{base:"218px",md:"262px"}} border="2px solid rgba(255,240,181,.72)" borderRadius="999px" boxShadow="0 0 30px rgba(255,229,157,.5)" animation={`v49-halo-open 1.15s ${delay+.04}s ease-out both`} zIndex="1"/>
    <Box opacity="0" position="absolute" left={left} top="50%" style={{ translate: "-50% -50%" }} w={{base:"118px",md:"138px"}} h={{base:"118px",md:"138px"}} border="2px solid rgba(255,247,209,.88)" borderRadius="20%" transform="rotate(45deg)" boxShadow="0 0 22px rgba(255,235,167,.5)" animation={`v49-sigil-spin 1.08s ${delay+.12}s ease-out both`} zIndex="3"/>
    <Box opacity="0" position="absolute" left={left} top="50%" style={{ translate: "-50% -50%" }} w={{ base: "56px", md: "64px" }} h={{ base: "154px", md: "174px" }} bg="linear-gradient(180deg,rgba(255,252,229,0),rgba(255,252,233,.98) 30%,rgba(255,225,136,.82) 62%,rgba(255,252,229,0))" boxShadow="0 0 34px rgba(255,240,180,.88)" animation={`v47-holy-pillar 1.05s ${delay + .08}s ease-out both`} zIndex="2" />
    <Box opacity="0" position="absolute" left={left} top="50%" style={{ translate: "-50% -50%" }} w={{ base: "104px", md: "120px" }} h={{ base: "104px", md: "120px" }} border="2px solid rgba(255,248,214,.94)" borderRadius="999px" boxShadow="0 0 30px rgba(255,239,179,.7)" animation={`v47-holy-cross .9s ${delay + .18}s ease-out both`} zIndex="5">
      <Box position="absolute" left="50%" top="12%" w="5px" h="76%" bg="linear-gradient(180deg,transparent,#FFFBE8,#F2D27D,transparent)" style={{ translate: "-50% 0" }} boxShadow="0 0 16px rgba(255,245,205,.95)" />
      <Box position="absolute" left="12%" top="50%" w="76%" h="5px" bg="linear-gradient(90deg,transparent,#FFFBE8,#F2D27D,transparent)" style={{ translate: "0 -50%" }} boxShadow="0 0 16px rgba(255,245,205,.95)" />
    </Box>
    {[0,1,2].map((i)=><Box opacity="0" key={i} position="absolute" left={left} top="50%" w={{base:`${138+i*24}px`,md:`${160+i*30}px`}} h={{base:`${138+i*24}px`,md:`${160+i*30}px`}} border={`${i===0?2:1}px solid rgba(255,235,165,${.72-i*.12})`} borderRadius="999px" boxShadow="0 0 24px rgba(255,228,145,.34)" style={{ translate: "-50% -50%", animation:`v47-holy-orbit ${1.0+i*.14}s ${delay+.08+i*.05}s ease-out both` }} zIndex="1" />)}
    <Box opacity="0" position="absolute" left={left} top="50%" w={{base:"92px",md:"108px"}} h={{base:"116px",md:"132px"}} bg="linear-gradient(135deg,transparent 20%,rgba(255,249,221,.8) 48%,transparent 70%)" clipPath="polygon(100% 50%,30% 8%,0 50%,30% 92%)" style={{translate:"-100% -50%",animation:`v49-wing-left .9s ${delay+.18}s ease-out both`}} zIndex="3"/>
    <Box opacity="0" position="absolute" left={left} top="50%" w={{base:"92px",md:"108px"}} h={{base:"116px",md:"132px"}} bg="linear-gradient(225deg,transparent 20%,rgba(255,249,221,.8) 48%,transparent 70%)" clipPath="polygon(0 50%,70% 8%,100% 50%,70% 92%)" style={{translate:"0 -50%",animation:`v49-wing-right .9s ${delay+.18}s ease-out both`}} zIndex="3"/>
    {Array.from({length:14}).map((_,i)=>{const a=(i/14)*Math.PI*2;const d=58+(i%4)*13;return <Box opacity="0" key={i} position="absolute" left={left} top="50%" w={i%2?"8px":"12px"} h={i%2?"3px":"4px"} borderRadius="99px" bg={i%2?"#FFF9DF":"#F5D98E"} boxShadow="0 0 16px rgba(255,239,184,.9)" style={{ translate:"-50% -50%", "--fx":`${Math.cos(a)*d}px`,"--fy":`${Math.sin(a)*d}px`,"--fr":`${i*27}deg`,animation:`v47-holy-feather .96s ${delay+.24+(i%4)*.04}s ease-out both` } as CSSProperties} zIndex="6" />})}
  </>;
}

function GuardPlace({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="31%" top="50%" style={{ translate: "-50% -50%" }} zIndex="3">
      {targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}
    </Box>
    <Box position="absolute" left="69%" top="50%" style={{ translate: "-50% -50%" }} zIndex="5" animation="v49-guard-slide .86s cubic-bezier(.18,.9,.25,1.08) both"><AnimatedCard card={card} /></Box>
    <Box position="absolute" left="69%" top="50%" style={{ translate: "-50% -50%" }} zIndex="6" animation="v49-guard-back .95s .28s ease-out both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
    <ShieldShell left="31%" delay={0.16} />
  </Box>;
}

function DestroyBlocked({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="21%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-caster .72s cubic-bezier(.16,.9,.22,1.18) both" zIndex="4"><AnimatedCard card={card} /></Box>
    <Box position="absolute" left="74%" top="50%" style={{ translate: "-50% -50%", animation: "v45-card-jolt 1.5s .12s ease-out both" } as CSSProperties} zIndex="3">{targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    <ShieldShell left="74%" delay={0.46} />
    <Box position="absolute" left="74%" top="50%" w={{ base: "92px", md: "112px" }} h={{ base: "92px", md: "112px" }} borderRadius="999px" bg="radial-gradient(circle,#FFF8D8 0 9%,#FFC25D 28%,#EF6E32 52%,rgba(239,110,50,.06) 74%,transparent 80%)" boxShadow="0 0 32px rgba(255,179,74,.75),0 0 55px rgba(239,93,46,.38)" style={{ translate: "-50% -50%" }} animation="v44-explosion-core .86s .42s ease-out both" zIndex="6" />
    {Array.from({ length: 2 }).map((_, i) => <Box key={i} position="absolute" left="74%" top="50%" w={{ base: `${110 + i * 24}px`, md: `${134 + i * 30}px` }} h={{ base: `${110 + i * 24}px`, md: `${134 + i * 30}px` }} border="4px solid rgba(255,194,99,.62)" borderRadius="999px" boxShadow="0 0 20px rgba(255,160,65,.38)" style={{ translate: "-50% -50%", animation: `v44-explosion-ring ${.78 + i * .1}s ${.44 + i * .05}s ease-out both` }} zIndex="5" />)}
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i / 6) * Math.PI * 2;
      const d = 32 + (i % 3) * 10;
      return <Box key={`smoke-${i}`} position="absolute" left="74%" top="50%" w="28px" h="28px" borderRadius="999px" bg="radial-gradient(circle,rgba(70,56,48,.48),rgba(24,21,20,.08) 70%,transparent)" style={{ translate: "-50% -50%", "--mx": `${Math.cos(a) * d}px`, "--my": `${Math.sin(a) * d}px`, animation: `v44-smoke .96s ${.48 + i * .03}s ease-out both` } as CSSProperties} zIndex="5" />;
    })}
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      const d = 42 + (i % 4) * 12;
      return <Box key={`shard-${i}`} position="absolute" left="74%" top="50%" w={i % 2 ? "7px" : "11px"} h={i % 2 ? "4px" : "7px"} bg={i % 3 === 0 ? "#FFF0C7" : i % 2 ? "#FFB654" : "#D96A32"} clipPath="polygon(0 0,100% 18%,74% 100%,16% 76%)" style={{ translate: "-50% -50%", "--sx": `${Math.cos(a) * d}px`, "--sy": `${Math.sin(a) * d}px`, "--sr": `${70 + i * 37}deg`, animation: `v40-shard .78s ${.46 + (i % 3) * .025}s ease-out both` } as CSSProperties} zIndex="8" />;
    })}
    <Box position="absolute" left="74%" top="50%" w={{ base: "160px", md: "194px" }} h={{ base: "160px", md: "194px" }} border="3px solid rgba(255,246,203,.9)" borderRadius="999px" boxShadow="0 0 34px rgba(255,235,169,.9),0 0 68px rgba(213,181,107,.55)" style={{ translate: "-50% -50%" }} animation="v45-guard-stop .8s .52s ease-out both" zIndex="8" />
    <Box position="absolute" left="74%" top="50%" w={{base:"210px",md:"250px"}} h={{base:"210px",md:"250px"}} borderRadius="999px" bg="radial-gradient(circle,rgba(255,252,226,.78) 0 8%,rgba(255,230,151,.34) 30%,rgba(255,255,255,0) 70%)" style={{translate:"-50% -50%"}} animation="v47-holy-impact .86s .50s ease-out both" zIndex="7" />
    <Box position="absolute" inset="0" bg="radial-gradient(circle at 74% 50%,rgba(255,248,210,.28),transparent 34%)" animation="v47-holy-flash .72s .5s ease-out both" zIndex="1" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const d = 36 + (i % 3) * 10;
      return <Box key={i} position="absolute" left="74%" top="50%" w="7px" h="7px" borderRadius="999px" bg={i % 2 ? "#FFF8DB" : "#F2D48B"} boxShadow="0 0 18px rgba(255,238,180,.95)" style={{ translate: "-50% -50%", "--sx": `${Math.cos(a) * d}px`, "--sy": `${Math.sin(a) * d}px`, "--sr": `${i * 45}deg`, animation: `v40-shard .72s ${.58 + (i % 2) * .03}s ease-out both` } as CSSProperties} zIndex="9" />;
    })}
  </Box>;
}

function GuardTutorialSequence({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" inset="0" animation="v46-scene-in .2s ease both, v46-scene-out 1.52s .1s ease both">
      <GuardPlace card={card} targetCard={targetCard} />
    </Box>

    <Box position="absolute" inset="0" opacity="0" animation="v46-scene-in .18s 1.68s ease both">
      <Box position="absolute" left="16%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-caster .55s 1.70s cubic-bezier(.16,.9,.22,1.18) both" zIndex="4"><AnimatedCard card={GUARD_TUTORIAL_ATTACKER} /></Box>

      <Box position="absolute" left="54%" top="50%" style={{ translate: "-50% -50%" }} zIndex="3">
        {targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}
      </Box>

      <Box
        position="absolute"
        left="66%"
        top="50%"
        w={{ base: "122px", md: "136px" }}
        h={{ base: "183px", md: "204px" }}
        style={{ translate: "-50% -50%", perspective: "900px" } as CSSProperties}
        zIndex="6"
      >
        <Box position="relative" w="100%" h="100%" transformStyle="preserve-3d" animation="v48-card-flip .44s 1.98s cubic-bezier(.22,.7,.2,1) both">
          <Box position="absolute" inset="0" backfaceVisibility="hidden"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
          <Box position="absolute" inset="0" transform="rotateY(180deg)" backfaceVisibility="hidden"><AnimatedCard card={card} /></Box>
        </Box>
      </Box>

      <ShieldShell left="60%" delay={2.22} />
      <Box position="absolute" left="60%" top="50%" w={{ base: "98px", md: "122px" }} h={{ base: "98px", md: "122px" }} borderRadius="999px" bg="radial-gradient(circle,#FFF8D8 0 9%,#FFC25D 28%,#EF6E32 52%,rgba(239,110,50,.06) 74%,transparent 80%)" boxShadow="0 0 32px rgba(255,179,74,.75),0 0 55px rgba(239,93,46,.38)" style={{ translate: "-50% -50%" }} animation="v44-explosion-core .82s 2.36s ease-out both" zIndex="6" />
      {Array.from({ length: 2 }).map((_, i) => <Box key={i} position="absolute" left="60%" top="50%" w={{ base: `${116 + i * 24}px`, md: `${140 + i * 30}px` }} h={{ base: `${116 + i * 24}px`, md: `${140 + i * 30}px` }} border="4px solid rgba(255,194,99,.62)" borderRadius="999px" boxShadow="0 0 20px rgba(255,160,65,.38)" style={{ translate: "-50% -50%", animation: `v44-explosion-ring ${.74 + i * .1}s ${2.38 + i * .05}s ease-out both` }} zIndex="5" />)}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const d = 32 + (i % 3) * 10;
        return <Box key={`tutorial-smoke-${i}`} position="absolute" left="60%" top="50%" w="28px" h="28px" borderRadius="999px" bg="radial-gradient(circle,rgba(70,56,48,.48),rgba(24,21,20,.08) 70%,transparent)" style={{ translate: "-50% -50%", "--mx": `${Math.cos(a) * d}px`, "--my": `${Math.sin(a) * d}px`, animation: `v44-smoke .96s ${2.40 + i * .03}s ease-out both` } as CSSProperties} zIndex="5" />;
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const d = 42 + (i % 4) * 12;
        return <Box key={`tutorial-shard-${i}`} position="absolute" left="60%" top="50%" w={i % 2 ? "7px" : "11px"} h={i % 2 ? "4px" : "7px"} bg={i % 3 === 0 ? "#FFF0C7" : i % 2 ? "#FFB654" : "#D96A32"} clipPath="polygon(0 0,100% 18%,74% 100%,16% 76%)" style={{ translate: "-50% -50%", "--sx": `${Math.cos(a) * d}px`, "--sy": `${Math.sin(a) * d}px`, "--sr": `${70 + i * 37}deg`, animation: `v40-shard .78s ${2.40 + (i % 3) * .025}s ease-out both` } as CSSProperties} zIndex="8" />;
      })}
      <Box position="absolute" left="60%" top="50%" w={{ base: "168px", md: "204px" }} h={{ base: "168px", md: "204px" }} border="3px solid rgba(255,246,203,.92)" borderRadius="999px" boxShadow="0 0 34px rgba(255,235,169,.9),0 0 68px rgba(213,181,107,.55)" style={{ translate: "-50% -50%" }} animation="v45-guard-stop .84s 2.42s ease-out both" zIndex="8" />
      <Box position="absolute" left="60%" top="50%" w={{ base: "220px", md: "260px" }} h={{ base: "220px", md: "260px" }} borderRadius="999px" bg="radial-gradient(circle,rgba(255,252,226,.78) 0 8%,rgba(255,230,151,.34) 30%,rgba(255,255,255,0) 70%)" style={{ translate: "-50% -50%" }} animation="v47-holy-impact .88s 2.40s ease-out both" zIndex="7" />
    </Box>
  </Box>;
}

function GuardShowcase({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="40%" top="50%" style={{ translate: "-50% -50%", animation: "v45-card-jolt 1.9s .58s ease-out both" } as CSSProperties} zIndex="3">
      {targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}
    </Box>
    <Box position="absolute" left="72%" top="50%" style={{ translate: "-50% -50%" }} zIndex="6" animation="v40-castcard 1.02s cubic-bezier(.15,.9,.22,1.12) both"><AnimatedCard card={card} /></Box>
    <Box position="absolute" left="72%" top="50%" style={{ translate: "-50% -50%" }} zIndex="5" animation="v40-backland 1.1s .16s cubic-bezier(.15,.9,.22,1.12) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
    <ShieldShell left="40%" delay={0.18} />
    <Box position="absolute" left="11%" top="50%" w={{ base: "190px", md: "265px" }} h="12px" transformOrigin="left center" bg="linear-gradient(90deg,rgba(255,186,90,.0),rgba(255,152,66,.95),rgba(255,241,184,.9))" boxShadow="0 0 24px rgba(255,176,80,.95)" style={{ translate: "0 -50%", "--travel": `${190}px`, animation: "v45-impact-travel .92s .95s ease-out both" } as CSSProperties} zIndex="2" />
    <Box position="absolute" left="40%" top="50%" w={{ base: "96px", md: "118px" }} h={{ base: "96px", md: "118px" }} borderRadius="999px" bg="radial-gradient(circle,#FFF8D8 0 9%,#FFC25D 28%,#EF6E32 52%,rgba(239,110,50,.06) 74%,transparent 80%)" boxShadow="0 0 32px rgba(255,179,74,.75),0 0 55px rgba(239,93,46,.38)" style={{ translate: "-50% -50%" }} animation="v44-explosion-core .86s 1.1s ease-out both" zIndex="6" />
    {Array.from({ length: 2 }).map((_, i) => <Box key={i} position="absolute" left="40%" top="50%" w={{ base: `${112 + i * 24}px`, md: `${136 + i * 30}px` }} h={{ base: `${112 + i * 24}px`, md: `${136 + i * 30}px` }} border="4px solid rgba(255,194,99,.62)" borderRadius="999px" boxShadow="0 0 20px rgba(255,160,65,.38)" style={{ translate: "-50% -50%", animation: `v44-explosion-ring ${.78 + i * .1}s ${1.12 + i * .05}s ease-out both` }} zIndex="5" />)}
    <Box position="absolute" left="40%" top="50%" w={{ base: "160px", md: "194px" }} h={{ base: "160px", md: "194px" }} border="3px solid rgba(184,239,255,.82)" borderRadius="999px" boxShadow="0 0 28px rgba(161,226,255,.72)" style={{ translate: "-50% -50%" }} animation="v45-guard-stop .8s 1.12s ease-out both" zIndex="8" />
  </Box>;
}

function Double({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <SceneTarget targetCard={targetCard} /><CastAndBack card={card} />
    {[0, 1, 2].map(i => <Box key={i} position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} w={`${138 + i * 18}px`} h={`${138 + i * 18}px`} border={`${i === 0 ? 3 : 1}px solid rgba(255,211,99,${.72 - i * .14})`} borderRadius="999px" boxShadow="0 0 30px rgba(255,196,62,.34)" animation={`v40-doublecore ${.92 + i * .12}s ${.2 + i * .06}s ease-out both`} zIndex="2" />)}
    {[-34, -12, 12, 34].map((x, i) => <Box key={x} position="absolute" left={`calc(36% + ${x}px)`} top="50%" w="4px" h="112px" bg="linear-gradient(180deg,transparent,#FFE69B,transparent)" boxShadow="0 0 16px rgba(255,222,130,.7)" style={{ translate: "-50% -50%", animation: `v41-amp-line .78s ${.28 + i * .06}s ease-out both` }} zIndex="4" />)}
  </Box>;
}

function Betray({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%" }} zIndex="3" animation="v40-betrayturn 1.22s .12s cubic-bezier(.2,.7,.2,1) both">{targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    <CastAndBack card={card} />
    {[-22, 22].map((r, i) => <Box key={r} position="absolute" left="36%" top="50%" style={{ translate: "-50% -50%", "--r": `${r}deg`, animation: `v40-slash .85s ${.34 + i * .16}s ease-out both` } as CSSProperties} w={{ base: "160px", md: "210px" }} h="6px" bg="linear-gradient(90deg,transparent,#A55BD7,#F0B7FF,transparent)" boxShadow="0 0 18px rgba(165,91,215,.9)" zIndex="7" />)}
  </Box>;
}

function Destroy({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="23%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-caster .72s cubic-bezier(.16,.9,.22,1.18) both" zIndex="4"><AnimatedCard card={card} /></Box>
    <Box position="absolute" left="76%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-hit 1.34s .12s cubic-bezier(.2,.75,.22,1) both" zIndex="3">{targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    <Box position="absolute" left="76%" top="50%" w={{ base: "120px", md: "155px" }} h={{ base: "120px", md: "155px" }} borderRadius="999px" bg="radial-gradient(circle,#FFF8D8 0 8%,#FFC25D 18%,#EF6E32 42%,rgba(239,110,50,.15) 68%,transparent 76%)" boxShadow="0 0 35px rgba(255,179,74,.85),0 0 65px rgba(239,93,46,.45)" style={{ translate: "-50% -50%" }} animation="v44-explosion-core .95s .34s ease-out both" zIndex="7" />
    {[0, 1].map((i) => <Box key={i} position="absolute" left="76%" top="50%" w={{ base: `${128 + i * 28}px`, md: `${160 + i * 34}px` }} h={{ base: `${128 + i * 28}px`, md: `${160 + i * 34}px` }} border="4px solid rgba(255,194,99,.72)" borderRadius="999px" boxShadow="0 0 26px rgba(255,160,65,.45)" style={{ translate: "-50% -50%", animation: `v44-explosion-ring ${.9 + i * .12}s ${.38 + i * .06}s ease-out both` }} zIndex="6" />)}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const d = 58 + (i % 4) * 14;
      return <Box key={i} position="absolute" left="76%" top="50%" w={i % 2 ? "7px" : "11px"} h={i % 2 ? "4px" : "7px"} bg={i % 3 === 0 ? "#FFF0C7" : i % 2 ? "#FFB654" : "#D96A32"} clipPath="polygon(0 0,100% 18%,74% 100%,16% 76%)" style={{ translate: "-50% -50%", "--sx": `${Math.cos(a) * d}px`, "--sy": `${Math.sin(a) * d}px`, "--sr": `${70 + i * 37}deg`, animation: `v40-shard .78s ${.46 + (i % 3) * .025}s ease-out both` } as CSSProperties} zIndex="8" />;
    })}
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i / 6) * Math.PI * 2;
      const d = 32 + (i % 3) * 10;
      return <Box key={`smoke-${i}`} position="absolute" left="76%" top="50%" w="28px" h="28px" borderRadius="999px" bg="radial-gradient(circle,rgba(70,56,48,.48),rgba(24,21,20,.08) 70%,transparent)" style={{ translate: "-50% -50%", "--mx": `${Math.cos(a) * d}px`, "--my": `${Math.sin(a) * d}px`, animation: `v44-smoke 1.05s ${.52 + i * .035}s ease-out both` } as CSSProperties} zIndex="5" />;
    })}
  </Box>;
}


function DestroyStackSequence({ card, targetCard, targetEffects }: {
  card: Card;
  targetCard: Card | null;
  targetEffects: LastActionEffectSnapshot[];
}) {
  const guardedIndex = targetEffects.findIndex((effect) => effect.outcome === "guarded");
  const hasGuard = guardedIndex >= 0;
  // 破壊は「一番新しく重ねられた札 → 古い札」の順で、
  // 1枚の公開・破壊が終わってから次の札へ進む。
  const step = 0.96;
  const firstDelay = 0.36;
  const baseDelay = firstDelay + targetEffects.length * step + 0.06;
  const baseLeft = "58%";
  const stackLeft = "74%";

  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left="18%" top="50%" style={{ translate: "-50% -50%" }} animation="v40-caster .62s cubic-bezier(.16,.9,.22,1.18) both" zIndex="4">
      <AnimatedCard card={card} />
    </Box>

    <Box
      position="absolute"
      left={baseLeft}
      top="50%"
      style={{ translate: "-50% -50%", ...(hasGuard ? {} : { animation: `v48-base-destroy .72s ${baseDelay}s ease-out both` }) } as CSSProperties}
      zIndex="1"
    >
      {targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}
    </Box>

    {targetEffects.map((effect, previewIndex) => {
      const offset = previewIndex * 7;
      const left = `calc(${stackLeft} + ${offset}px)`;
      const previewDelay = Math.max(0, firstDelay - 0.22 + previewIndex * 0.03);
      const consumeDelay = firstDelay + previewIndex * step;
      return (
        <Box
          key={`preview-${effect.card.id}-${previewIndex}`}
          position="absolute"
          left={left}
          top="50%"
          style={{ translate: "-50% -50%", animation: `v48-card-slot .18s ${previewDelay}s ease-out both` } as CSSProperties}
          zIndex={60 - previewIndex}
          opacity={Math.max(0.72, 0.96 - previewIndex * 0.05)}
          pointerEvents="none"
        >
          <Box animation={`v68-preview-hide .08s ${consumeDelay}s linear forwards`}>
            <AnimatedCard card={effect.wasFaceUp ? effect.card : HIDDEN_CARD} hidden={!effect.wasFaceUp} />
          </Box>
        </Box>
      );
    })}

    {targetEffects.map((effect, index) => {
      const delay = firstDelay + index * step;
      const isGuard = effect.outcome === "guarded";
      return (
        <Box key={`${effect.card.id}-${index}`} position="absolute" inset="0" pointerEvents="none">
          <Box
            position="absolute"
            left={stackLeft}
            top="50%"
            w={{ base: "122px", md: "136px" }}
            h={{ base: "183px", md: "204px" }}
            style={{
              translate: "-50% -50%",
              animation: `v48-card-slot .10s ${delay}s linear both`,
              perspective: "850px",
            } as CSSProperties}
            zIndex={80}
          >
            <Box
              position="relative"
              w="100%"
              h="100%"
              animation={isGuard
                ? `v71-guard-break .46s ${delay + (effect.wasFaceUp ? .36 : .64)}s ease-out forwards`
                : `v48-card-break .30s ${delay + (effect.wasFaceUp ? .26 : .64)}s ease-out forwards`}
            >
              {effect.wasFaceUp ? (
                <AnimatedCard card={effect.card} />
              ) : (
                <Box position="relative" w="100%" h="100%" transformStyle="preserve-3d" animation={`v48-card-flip .46s ${delay + .06}s cubic-bezier(.22,.7,.2,1) both`}>
                  <Box position="absolute" inset="0" backfaceVisibility="hidden"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
                  <Box position="absolute" inset="0" transform="rotateY(180deg)" backfaceVisibility="hidden"><AnimatedCard card={effect.card} /></Box>
                </Box>
              )}
            </Box>
          </Box>

          {!isGuard && (
            <>
              <Box
                position="absolute"
                left={stackLeft}
                top="50%"
                w={{ base: "92px", md: "112px" }}
                h={{ base: "92px", md: "112px" }}
                borderRadius="999px"
                bg="radial-gradient(circle,#FFF8D8 0 8%,#FFC25D 22%,#EF6E32 48%,rgba(239,110,50,.08) 72%,transparent 80%)"
                boxShadow="0 0 28px rgba(255,179,74,.78),0 0 50px rgba(239,93,46,.35)"
                style={{ translate: "-50% -50%" }}
                animation={`v44-explosion-core .42s ${delay + (effect.wasFaceUp ? .16 : .54)}s ease-out both`}
                zIndex={20 + index}
              />
              <Box
                position="absolute"
                left={stackLeft}
                top="50%"
                w={{ base: "116px", md: "138px" }}
                h={{ base: "116px", md: "138px" }}
                border="3px solid rgba(255,194,99,.65)"
                borderRadius="999px"
                style={{ translate: "-50% -50%" }}
                animation={`v44-explosion-ring .44s ${delay + (effect.wasFaceUp ? .17 : .55)}s ease-out both`}
                zIndex={19 + index}
              />
            </>
          )}

          {isGuard && (
            <>
              <ShieldShell left={stackLeft} delay={delay + (effect.wasFaceUp ? .24 : .50)} />
              <Box
                position="absolute"
                left={stackLeft}
                top="50%"
                w={{ base: "108px", md: "130px" }}
                h={{ base: "108px", md: "130px" }}
                borderRadius="999px"
                bg="radial-gradient(circle,#FFFDF0 0 8%,#FFD16A 24%,#EF7A36 50%,rgba(239,122,54,.08) 74%,transparent 82%)"
                boxShadow="0 0 34px rgba(255,206,105,.85),0 0 62px rgba(255,255,220,.36)"
                style={{ translate: "-50% -50%" }}
                animation={`v44-explosion-core .50s ${delay + (effect.wasFaceUp ? .28 : .54)}s ease-out both`}
                zIndex={28 + index}
              />
              <Box
                position="absolute"
                left={stackLeft}
                top="50%"
                w={{ base: "178px", md: "210px" }}
                h={{ base: "178px", md: "210px" }}
                border="3px solid rgba(255,247,201,.94)"
                borderRadius="999px"
                boxShadow="0 0 36px rgba(255,241,184,.84), inset 0 0 28px rgba(255,255,240,.38)"
                style={{ translate: "-50% -50%" }}
                animation={`v47-holy-impact .62s ${delay + (effect.wasFaceUp ? .30 : .56)}s ease-out both`}
                zIndex={30 + index}
              />
              {Array.from({ length: 10 }).map((_, sparkIndex) => {
                const angle = (sparkIndex / 10) * Math.PI * 2;
                const distance = 54 + (sparkIndex % 3) * 11;
                return <Box
                  key={`guard-spark-${sparkIndex}`}
                  position="absolute"
                  left={stackLeft}
                  top="50%"
                  w={sparkIndex % 2 ? "5px" : "8px"}
                  h={sparkIndex % 2 ? "13px" : "18px"}
                  borderRadius="999px 999px 45% 45%"
                  bg="linear-gradient(180deg,#FFFCE8,#F5D985 55%,rgba(245,217,133,0))"
                  boxShadow="0 0 14px rgba(255,247,205,.92)"
                  style={{
                    translate: "-50% -50%",
                    "--fx": `${Math.cos(angle) * distance}px`,
                    "--fy": `${Math.sin(angle) * distance}px`,
                    "--fr": `${sparkIndex * 31}deg`,
                    animation: `v47-holy-feather .58s ${delay + (effect.wasFaceUp ? .34 : .60) + (sparkIndex % 3) * .02}s ease-out both`,
                  } as CSSProperties}
                  zIndex={31 + index}
                />;
              })}
            </>
          )}
        </Box>
      );
    })}

    {!hasGuard && (
      <>
        <Box
          position="absolute"
          left={baseLeft}
          top="50%"
          w={{ base: "120px", md: "150px" }}
          h={{ base: "120px", md: "150px" }}
          borderRadius="999px"
          bg="radial-gradient(circle,#FFF8D8 0 8%,#FFC25D 18%,#EF6E32 42%,rgba(239,110,50,.12) 68%,transparent 76%)"
          boxShadow="0 0 35px rgba(255,179,74,.85),0 0 65px rgba(239,93,46,.42)"
          style={{ translate: "-50% -50%" }}
          animation={`v44-explosion-core .66s ${baseDelay + .02}s ease-out both`}
          zIndex="45"
        />
        <Box
          position="absolute"
          left={baseLeft}
          top="50%"
          w={{ base: "150px", md: "184px" }}
          h={{ base: "150px", md: "184px" }}
          border="4px solid rgba(255,194,99,.72)"
          borderRadius="999px"
          style={{ translate: "-50% -50%" }}
          animation={`v44-explosion-ring .72s ${baseDelay + .04}s ease-out both`}
          zIndex="44"
        />
      </>
    )}
  </Box>;
}

function TruthMultiple({ card, targetCard, targetEffects }: {
  card: Card;
  targetCard: Card | null;
  targetEffects: LastActionEffectSnapshot[];
}) {
  const visibleEffects = targetEffects.filter((effect) => effect.outcome === "revealed");
  const count = visibleEffects.length;
  const totalCards = (targetCard ? 1 : 0) + count;
  const stackSpacing = count <= 2 ? 94 : count === 3 ? 88 : count === 4 ? 82 : 76;
  const sourceLeft = 14;
  const revealGroupCenter = 64;

  return <Box position="relative" w="100%" h="100%">
    <Box position="absolute" left={`${sourceLeft}%`} top="50%" style={{ translate: "-50% -50%" }} zIndex="7"><AnimatedCard card={card} /></Box>

    <Box position="absolute" left={`${revealGroupCenter}%`} top="50%" w={{ base: "360px", md: "520px" }} h={{ base: "240px", md: "280px" }} style={{ translate: "-50% -50%" }} zIndex="1">
      <Box position="absolute" inset="0" bg="radial-gradient(circle,rgba(255,248,214,.22) 0 16%,rgba(229,201,110,.12) 40%,transparent 72%)" animation="v50-truth-flare 1.15s .08s ease-out both" />
      <Box position="absolute" left="50%" top="50%" w={{ base: "280px", md: "380px" }} h={{ base: "220px", md: "250px" }} border="2px solid rgba(255,244,203,.56)" borderRadius="999px" boxShadow="0 0 28px rgba(255,245,210,.22), inset 0 0 34px rgba(255,237,184,.12)" style={{ translate: "-50% -50%" }} animation="v40-eye 1.35s ease-out both" />
      <Box position="absolute" left="50%" top="50%" w={{ base: "300px", md: "410px" }} h="6px" bg="linear-gradient(90deg,transparent,#FFF7D4,#FFF2B4,transparent)" boxShadow="0 0 24px rgba(255,248,210,.82)" style={{ translate: "-50% -50%" }} animation="v40-scan 1.45s ease-in-out both" zIndex="4" />
      {Array.from({ length: 12 }).map((_, i) => (
        <Box
          key={`truth-ray-${i}`}
          position="absolute"
          left="50%"
          top="50%"
          w="3px"
          h={{ base: "96px", md: "118px" }}
          borderRadius="999px"
          bg="linear-gradient(180deg,rgba(255,253,240,0),rgba(255,244,188,.96) 45%,rgba(255,253,240,0))"
          boxShadow="0 0 16px rgba(255,242,182,.86)"
          style={{ "--tr": `${i * 30}deg`, animation: `v50-truth-ray .9s ${0.1 + (i % 6) * .04}s ease-out both` } as CSSProperties}
          zIndex="2"
        />
      ))}
    </Box>

    {targetCard && (() => {
      const baseOffsetPx = totalCards > 1 ? ((0 - (totalCards - 1) / 2) * stackSpacing) : 0;
      return (
        <Box position="absolute" left={`calc(${revealGroupCenter}% + ${baseOffsetPx}px)`} top="50%" transform="translate(-50%, -50%)" zIndex="8" opacity=".98">
          <Box filter="drop-shadow(0 0 18px rgba(255,242,191,.22))"><AnimatedCard card={targetCard} /></Box>
        </Box>
      );
    })()}

    {visibleEffects.map((effect, index) => {
      const cardSlotIndex = (targetCard ? 1 : 0) + index;
      const offsetPx = totalCards > 1 ? ((cardSlotIndex - (totalCards - 1) / 2) * stackSpacing) : 0;
      const delay = 0.32 + index * 0.34;
      return (
        <Box key={`${effect.card.id}-${index}`} position="absolute" inset="0" pointerEvents="none">
          <Box
            position="absolute"
            left={`calc(${revealGroupCenter}% + ${offsetPx}px)`}
            top="50%"
            w={{ base: "122px", md: "136px" }}
            h={{ base: "183px", md: "204px" }}
            transform="translate(-50%, -50%)"
            style={{ perspective: "900px" } as CSSProperties}
            zIndex={20 + index}
          >
            <Box position="absolute" inset={-8} border="1px solid rgba(255,245,199,.16)" borderRadius="18px" boxShadow="0 0 20px rgba(255,235,171,.08)" />
            <Box position="relative" w="100%" h="100%" transformStyle="preserve-3d" transformOrigin="center center" animation={`v48-card-flip 1.02s ${delay}s cubic-bezier(.22,.7,.2,1) both`}>
              <Box position="absolute" inset="0" backfaceVisibility="hidden" display="flex" alignItems="center" justifyContent="center" transformOrigin="center center">
                <AnimatedCard card={HIDDEN_CARD} hidden />
              </Box>
              <Box position="absolute" inset="0" transform="rotateY(180deg)" backfaceVisibility="hidden" display="flex" alignItems="center" justifyContent="center" transformOrigin="center center">
                <AnimatedCard card={effect.card} />
              </Box>
            </Box>
            <Box position="absolute" inset={-18} border="1px solid rgba(255,247,201,.62)" borderRadius="20px" boxShadow="0 0 26px rgba(255,239,184,.24)" animation={`v48-spark-pop .78s ${delay + .44}s ease-out both`} />
            <Box position="absolute" inset={-28} border="2px solid rgba(255,248,214,.18)" borderRadius="26px" animation={`v50-truth-flare .9s ${delay + .28}s ease-out both`} />
            {Array.from({ length: 8 }).map((_, sparkIndex) => {
              const angle = (sparkIndex / 8) * Math.PI * 2;
              const distance = 48 + (sparkIndex % 2) * 16;
              return <Box
                key={`truth-spark-${index}-${sparkIndex}`}
                position="absolute"
                left="50%"
                top="50%"
                w={sparkIndex % 2 ? "5px" : "8px"}
                h={sparkIndex % 2 ? "14px" : "18px"}
                borderRadius="999px 999px 45% 45%"
                bg="linear-gradient(180deg,#FFFDEB,#F4DB8B 58%,rgba(244,219,139,0))"
                boxShadow="0 0 14px rgba(255,247,205,.9)"
                style={{
                  translate: "-50% -50%",
                  "--fx": `${Math.cos(angle) * distance}px`,
                  "--fy": `${Math.sin(angle) * distance}px`,
                  "--fr": `${sparkIndex * 36}deg`,
                  animation: `v47-holy-feather .72s ${delay + .38 + sparkIndex * .02}s ease-out both`,
                } as CSSProperties}
                zIndex={28 + index}
              />;
            })}
          </Box>
        </Box>
      );
    })}
  </Box>;
}

function Moratorium({ card }: { card: Card }) {
  return <HStack gap={{ base: "8", md: "14" }} align="center">
    <Box position="relative">
      {[0, 1].map(i => <Box key={i} position="absolute" inset={-12 - i * 12} border={`${i === 0 ? 2 : 1}px solid rgba(186,159,240,${.62 - i * .12})`} borderRadius="18px" boxShadow="0 0 24px rgba(177,145,235,.36)" animation={`v41-moratorium-aura ${.85 + i * .14}s ${.08 + i * .08}s ease-out both`} />)}
      <Box animation="v41-moratorium-fade 1.15s ease-out both"><AnimatedCard card={card} /></Box>
    </Box>
    <Box position="relative">
      <Box animation="v40-draw 1.2s .5s cubic-bezier(.17,.9,.24,1.14) both"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
      <Box position="absolute" inset="-14px" border="1px solid rgba(180,153,236,.5)" borderRadius="18px" animation="v41-moratorium-aura 1.0s .42s ease-out both" />
    </Box>
  </HStack>;
}

function Revive({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <HStack gap={{ base: "6", md: "12" }} align="center">
    <Box opacity=".72"><AnimatedCard card={card} /></Box>
    <Box position="relative">
      {Array.from({ length: 6 }).map((_, i) => <Box key={i} position="absolute" left={`${20 + i * 12}%`} bottom="10%" w="5px" h="36px" borderRadius="999px" bg="linear-gradient(180deg,transparent,#EED88A,transparent)" style={{ "--wx": `${(i - 2.5) * 8}px`, animation: `v40-wisp ${.9 + (i % 3) * .12}s ${i * .06}s ease-out both` } as CSSProperties} />)}
      <Box animation="v40-revive 1.28s cubic-bezier(.18,.9,.22,1.2) both">{targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
    </Box>
  </HStack>;
}

function Truth({ card, targetCard }: { card: Card; targetCard: Card | null }) {
  return <HStack gap={{ base: "6", md: "12" }} align="center">
    <AnimatedCard card={card} />
    <Box position="relative" w={{ base: "140px", md: "155px" }} h={{ base: "190px", md: "210px" }} display="flex" alignItems="center" justifyContent="center" style={{ perspective: "850px" }}>
      <Box position="absolute" w="145px" h="70px" border="2px solid rgba(245,239,205,.62)" borderRadius="52%" boxShadow="0 0 25px rgba(245,239,205,.25)" animation="v40-eye 1.25s ease-out both" />
      <Box position="absolute" w="130px" h="5px" bg="linear-gradient(90deg,transparent,#FFF8D5,transparent)" boxShadow="0 0 16px rgba(255,250,221,.8)" animation="v40-scan 1.2s ease-in-out both" />
      <Box position="relative" w={{ base: "122px", md: "136px" }} h={{ base: "183px", md: "204px" }} transformStyle="preserve-3d" animation="v40-truthflip 1.35s cubic-bezier(.25,.65,.2,1) both">
        <Box position="absolute" inset="0" backfaceVisibility="hidden"><AnimatedCard card={HIDDEN_CARD} hidden /></Box>
        <Box position="absolute" inset="0" transform="rotateY(180deg)" backfaceVisibility="hidden">{targetCard ? <AnimatedCard card={targetCard} /> : <AnimatedCard card={HIDDEN_CARD} hidden />}</Box>
      </Box>
    </Box>
  </HStack>;
}
