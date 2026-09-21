"use client";

import { useEffect, useState } from "react";
import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { playGameSfx } from "@/components/BgmController";

const STEPS = [
  {
    eyebrow: "01 / DRAFT",
    title: "まずは7枚を選び取る",
    body: "配られたカードから1枚選び、残りを次のプレイヤーへ。これを繰り返して7枚の手札を作ります。",
    visual: "draft",
  },
  {
    eyebrow: "02 / POINT",
    title: "高い数字は得点に",
    body: "カードはそのまま自分の場へ置けば数字がポイントになります。高数字は大きな得点源です。",
    visual: "point",
  },
  {
    eyebrow: "03 / MAGIC",
    title: "低い数字でも魔法で逆転",
    body: "破壊・守護・増大・裏切り・モラトリアム・復活・真実。数字が低くても効果の使い方で価値が変わります。",
    visual: "magic",
  },
  {
    eyebrow: "04 / BLUFF",
    title: "伏せ札が読み合いを生む",
    body: "守護・増大・裏切りは伏せて重ねます。相手には中身が見えないため、二重裏切りなどのブラフも可能です。",
    visual: "bluff",
  },
  {
    eyebrow: "05 / REVEAL",
    title: "最後に一斉開示して集計",
    body: "全員の手札がなくなると伏せた魔法を順番に公開。守護は+1、増大は×2、裏切りは×−1として最終得点を決めます。",
    visual: "reveal",
  },
] as const;

export default function HowToPlayTutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  useEffect(() => {
    playGameSfx(step === 4 ? "reveal" : step >= 2 ? "magic" : "card");
  }, [step]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setStep((v) => Math.min(v + 1, STEPS.length - 1));
      if (event.key === "ArrowLeft") setStep((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <Box position="fixed" inset="0" zIndex="10000" bg="rgba(2,3,5,.88)" backdropFilter="blur(10px)" overflowY="auto" p={{ base: "4", md: "8" }}>
      <style>{`
        @keyframes sm-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes sm-deal-left { 0% { transform: translate(85px, 45px) rotate(10deg); opacity: .1; } 100% { transform: translate(-58px, 0) rotate(-11deg); opacity: 1; } }
        @keyframes sm-deal-center { 0% { transform: translate(70px, 42px) scale(.82); opacity: .1; } 100% { transform: translate(0, -10px) scale(1.05); opacity: 1; } }
        @keyframes sm-deal-right { 0% { transform: translate(55px, 40px) rotate(-8deg); opacity: .1; } 100% { transform: translate(58px, 0) rotate(11deg); opacity: 1; } }
        @keyframes sm-drop { 0% { transform: translateY(-78px) scale(.85); opacity: 0; } 55% { transform: translateY(7px) scale(1.03); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes sm-glow { 0%,100% { box-shadow: 0 0 8px rgba(215,181,109,.18); } 50% { box-shadow: 0 0 34px rgba(215,181,109,.65); } }
        @keyframes sm-stack1 { 0% { transform: translate(0,-74px) rotate(-8deg); opacity:0; } 100% { transform: translate(-14px,7px) rotate(-7deg); opacity:1; } }
        @keyframes sm-stack2 { 0%,35% { transform: translate(0,-80px) rotate(9deg); opacity:0; } 100% { transform: translate(14px,-2px) rotate(6deg); opacity:1; } }
        @keyframes sm-flip { 0%,38% { transform: rotateY(0deg); } 62%,100% { transform: rotateY(180deg); } }
        @keyframes sm-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Box maxW="920px" mx="auto" minH="calc(100vh - 64px)" display="flex" alignItems="center">
        <Box w="full" bg="linear-gradient(180deg, rgba(24,20,13,.98), rgba(6,7,9,.98))" border="1px solid rgba(215,181,109,.48)" borderRadius="16px" boxShadow="0 24px 80px rgba(0,0,0,.62), inset 0 0 42px rgba(0,0,0,.45)" p={{ base: "5", md: "8" }}>
          <HStack justify="space-between" align="start" mb="5">
            <VStack align="start" gap="0">
              <Text fontSize="11px" letterSpacing=".32em" color="#9C855D">HOW TO PLAY</Text>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} color="#F3E5BF" fontWeight="500">7つの魔法の遊び方</Heading>
            </VStack>
            <Button size="sm" variant="ghost" color="#C8B994" onClick={onClose}>閉じる ×</Button>
          </HStack>

          <Box key={step} animation="sm-in .34s ease both">
            <Box minH={{ base: "255px", md: "310px" }} border="1px solid rgba(215,181,109,.22)" borderRadius="12px" bg="radial-gradient(circle at 50% 45%, rgba(215,181,109,.12), transparent 42%), rgba(3,4,6,.68)" display="flex" alignItems="center" justifyContent="center" overflow="hidden" position="relative">
              <TutorialVisual kind={current.visual} />
            </Box>

            <VStack mt="6" gap="2" textAlign="center">
              <Text fontSize="11px" letterSpacing=".28em" color="#B89758">{current.eyebrow}</Text>
              <Heading fontSize={{ base: "xl", md: "2xl" }} color="#F5EFE2" fontWeight="500">{current.title}</Heading>
              <Text maxW="680px" color="#BDB4A3" lineHeight="1.9" fontSize={{ base: "sm", md: "md" }}>{current.body}</Text>
            </VStack>
          </Box>

          <HStack mt="7" justify="space-between" gap="3" flexWrap="wrap">
            <HStack gap="2">
              {STEPS.map((_, i) => (
                <Box key={i} w={i === step ? "26px" : "8px"} h="8px" borderRadius="99px" bg={i === step ? "#D7B56D" : "rgba(215,181,109,.24)"} transition="all .2s ease" />
              ))}
            </HStack>
            <HStack gap="2">
              <Button size="sm" variant="outline" borderColor="rgba(215,181,109,.35)" color="#D8C9A7" disabled={step === 0} onClick={() => setStep((v) => Math.max(0, v - 1))}>← 前へ</Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" bg="linear-gradient(180deg, #392A16, #171008)" color="#F3E3B9" border="1px solid #9E7A3C" onClick={() => setStep((v) => Math.min(STEPS.length - 1, v + 1))}>次へ →</Button>
              ) : (
                <Button size="sm" bg="linear-gradient(180deg, #5A421F, #211609)" color="#FFF1C6" border="1px solid #C39B52" onClick={onClose}>ゲームを始める</Button>
              )}
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}

function TutorialVisual({ kind }: { kind: typeof STEPS[number]["visual"] }) {
  if (kind === "draft") {
    return <HStack gap="0" position="relative" w="260px" h="180px" justify="center"><MiniCard label="2" magic="真実" style={{ animation: "sm-deal-left .8s ease both" }} /><MiniCard label="7" magic="増大" gold style={{ zIndex: 2, animation: "sm-deal-center .8s .08s ease both" }} /><MiniCard label="4" magic="裏切り" style={{ animation: "sm-deal-right .8s .16s ease both" }} /></HStack>;
  }
  if (kind === "point") {
    return <VStack gap="3"><MiniCard label="7" magic="守護" gold style={{ animation: "sm-drop .75s ease both, sm-glow 2.2s .8s ease infinite" }} /><Text color="#F3D48A" fontSize="xl" fontWeight="700">+7 pt</Text></VStack>;
  }
  if (kind === "magic") {
    return <HStack gap={{ base: "3", md: "6" }}><MiniCard label="2" magic="破壊" style={{ animation: "sm-float 2.2s ease-in-out infinite" }} /><Text fontSize="3xl" color="#D7B56D">✦</Text><MiniCard label="1" magic="モラトリアム" gold style={{ animation: "sm-glow 1.6s ease-in-out infinite" }} /></HStack>;
  }
  if (kind === "bluff") {
    return <Box w="240px" h="190px" position="relative"><Box position="absolute" left="76px" top="42px"><MiniCard label="4" magic="POINT" gold /></Box><Box position="absolute" left="89px" top="33px" style={{ animation: "sm-stack1 .7s .12s ease both" }}><BackCard /></Box><Box position="absolute" left="101px" top="24px" style={{ animation: "sm-stack2 .8s .42s ease both" }}><BackCard /></Box><Text position="absolute" bottom="5px" w="full" textAlign="center" color="#BFAE8C" fontSize="sm">裏切り × 裏切り ＝ 正に戻る</Text></Box>;
  }
  return <HStack gap="5"><Box style={{ perspective: "800px" }}><Box position="relative" w="98px" h="142px" transformStyle="preserve-3d" style={{ animation: "sm-flip 2.2s ease-in-out infinite" }}><Box position="absolute" inset="0" backfaceVisibility="hidden"><BackCard /></Box><Box position="absolute" inset="0" transform="rotateY(180deg)" backfaceVisibility="hidden"><MiniCard label="×−1" magic="裏切り" /></Box></Box></Box><Text fontSize="3xl" color="#D7B56D">→</Text><VStack gap="0"><Text color="#AFA594" fontSize="sm">FINAL SCORE</Text><Text color="#F3D48A" fontSize="4xl" fontWeight="700">24 pt</Text></VStack></HStack>;
}

function MiniCard({ label, magic, gold = false, style }: { label: string; magic: string; gold?: boolean; style?: React.CSSProperties }) {
  return <Box w="98px" h="142px" borderRadius="9px" border="1px solid" borderColor={gold ? "#D7B56D" : "rgba(215,181,109,.42)"} bg={gold ? "linear-gradient(145deg,#3E2C13,#0B0C10 70%)" : "linear-gradient(145deg,#151922,#08090C 72%)"} boxShadow="0 12px 26px rgba(0,0,0,.45)" display="flex" flexDir="column" alignItems="center" justifyContent="center" color="#F3E5BF" flexShrink={0} style={style}><Text fontSize="3xl" fontWeight="700">{label}</Text><Text mt="2" fontSize="10px" letterSpacing=".12em" color={gold ? "#D7B56D" : "#AFA594"}>{magic}</Text></Box>;
}

function BackCard() {
  return <Box w="98px" h="142px" borderRadius="9px" border="1px solid rgba(215,181,109,.58)" bg="repeating-linear-gradient(45deg, #15100A 0 8px, #261C0D 8px 10px)" boxShadow="0 12px 28px rgba(0,0,0,.52), inset 0 0 0 5px #08090B" display="flex" alignItems="center" justifyContent="center"><Text color="#D7B56D" fontSize="2xl">✦</Text></Box>;
}
