"use client";

import { useEffect } from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import CardActionAnimation from "@/components/CardActionAnimation";
import { playGameSfx } from "@/components/BgmController";
import type { Card, LastActionKind } from "@/game/types";

const HIDDEN_CARD: Card = { id: "action-hidden", number: 1, magic: "truth" };

export default function ActionOverlay({
  actorName,
  action,
  card,
  hidden = false,
  label = "PLAYER ACTION",
  onContinue,
  autoContinueMs,
  showContinueButton = true,
  continueLabel = "次へ",
  actionKind,
  targetCard = null,
}: {
  actorName: string;
  action: string;
  card?: Card | null;
  hidden?: boolean;
  label?: string;
  onContinue: () => void;
  autoContinueMs?: number;
  showContinueButton?: boolean;
  continueLabel?: string;
  actionKind?: LastActionKind;
  targetCard?: Card | null;
}) {
  useEffect(() => {
    if (actionKind === "summon" || actionKind === "draft") {
      playGameSfx("card");
      return;
    }
    playGameSfx(hidden ? "mystery" : "magic");
  }, [action, hidden, actionKind]);

  useEffect(() => {
    if (!autoContinueMs || autoContinueMs <= 0) return;
    const timer = window.setTimeout(onContinue, autoContinueMs);
    return () => window.clearTimeout(timer);
  }, [autoContinueMs, onContinue]);

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="1000"
      bg="rgba(0, 0, 0, 0.80)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "2", md: "4" }}
      py={{ base: "2", md: "4" }}
      backdropFilter="blur(4px)"
      overflow="hidden"
    >
      <Box
        w={{ base: "100%", md: "720px" }}
        maxW="720px"
        maxH="calc(100dvh - 16px)"
        bg="linear-gradient(180deg, rgba(23,19,13,.99), rgba(6,7,9,.99))"
        border="1px solid rgba(215,181,109,.58)"
        borderRadius="10px"
        boxShadow="2xl"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Box
          flex="1"
          minH="0"
          overflowY="auto"
          overscrollBehavior="contain"
          px={{ base: "4", md: "6" }}
          pt={{ base: "4", md: "5" }}
          pb={{ base: "3", md: "4" }}
        >
          <VStack gap={{ base: "3", md: "4" }}>
            <VStack gap="0">
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="bold"
                color="#D7B56D"
                letterSpacing="0.20em"
              >
                {label}
              </Text>
              <Heading fontSize={{ base: "lg", md: "xl" }} textAlign="center">
                ◇ {actorName} の行動
              </Heading>
            </VStack>

            {(card || hidden) && (
              <Box w="full" display="flex" justifyContent="center" overflow="hidden">
                <CardActionAnimation
                  card={card ?? HIDDEN_CARD}
                  hidden={hidden}
                  actionKind={actionKind}
                  targetCard={targetCard}
                />
              </Box>
            )}

            <Box
              w="full"
              px={{ base: "3", md: "4" }}
              py={{ base: "2.5", md: "3" }}
              borderRadius="8px"
              bg="rgba(255,255,255,.04)"
              border="1px solid rgba(215,181,109,.20)"
            >
              <Text
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.6"
                textAlign="center"
              >
                {action}
              </Text>
            </Box>
          </VStack>
        </Box>

        {showContinueButton && (
          <Box
            flexShrink={0}
            px={{ base: "4", md: "6" }}
            py={{ base: "3", md: "4" }}
            bg="linear-gradient(180deg, rgba(10,9,7,.9), rgba(4,5,7,.99))"
            borderTop="1px solid rgba(215,181,109,.18)"
            boxShadow="0 -12px 28px rgba(0,0,0,.34)"
          >
            <Button
              size="md"
              h={{ base: "44px", md: "48px" }}
              w="full"
              bg="linear-gradient(180deg, #392A16, #171008)"
              color="#F3E3B9"
              border="1px solid #9E7A3C"
              borderRadius="6px"
              _hover={{
                borderColor: "#D7B56D",
                boxShadow: "0 0 18px rgba(215,181,109,.22)",
              }}
              onClick={onContinue}
            >
              {continueLabel}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
