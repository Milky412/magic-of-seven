"use client";

import { Box, HStack, VStack } from "@chakra-ui/react";
import MagicCard from "@/components/MagicCard";
import type { FieldStack } from "@/game/types";

const HIDDEN_PLACEHOLDER = {
  id: "field-hidden-placeholder",
  number: 1,
  magic: "truth" as const,
};

export default function FieldStackView({
  stack,
  onClick,
  selectable = false,
  onPreviewCard,
}: {
  stack: FieldStack;
  onClick?: () => void;
  selectable?: boolean;
  onPreviewCard?: (card: FieldStack["baseCard"]) => void;
}) {
  return (
    <Box
      onClick={onClick}
      cursor={selectable ? "pointer" : "default"}
      p="3"
      border="1px solid"
      borderColor={selectable ? "#D7B56D" : "rgba(215,181,109,.28)"}
      borderRadius="8px"
      bg="linear-gradient(180deg, rgba(22,18,12,.82), rgba(7,8,10,.88))"
      minW="132px"
      boxShadow={selectable ? "0 0 18px rgba(215,181,109,.18)" : "inset 0 0 18px rgba(0,0,0,.52)"}
      _hover={
        selectable
          ? {
              borderColor: "#F0D08A",
              transform: "translateY(-2px)",
              boxShadow: "0 0 20px rgba(215,181,109,.22)",
            }
          : undefined
      }
      transition="all .15s ease"
    >
      <VStack align="stretch" gap="2">
        <Box
          display="flex"
          justifyContent="center"
          onClick={(e) => {
            if (selectable || !onPreviewCard) return;
            e.stopPropagation();
            onPreviewCard(stack.baseCard);
          }}
        >
          <MagicCard card={stack.baseCard} size="small" />
        </Box>

        {stack.effects.length > 0 && (
          <HStack gap="1" wrap="wrap" justify="center">
            {stack.effects.map((effect, i) => (
              <Box
                key={`${effect.card.id}-${i}`}
                cursor={!selectable && effect.isFaceUp && onPreviewCard ? "zoom-in" : selectable ? "pointer" : "default"}
                onClick={(e) => {
                  if (selectable || !effect.isFaceUp || !onPreviewCard) return;
                  e.stopPropagation();
                  onPreviewCard(effect.card);
                }}
              >
                <MagicCard
                  card={effect.isFaceUp ? effect.card : { ...HIDDEN_PLACEHOLDER, id: effect.card.id }}
                  hidden={!effect.isFaceUp}
                  size="small"
                />
              </Box>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
