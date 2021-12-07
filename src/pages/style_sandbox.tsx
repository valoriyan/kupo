import Image from "next/image";
import { Stack } from "#/components/Layout";
import { BrandTitle, headingStyles } from "#/components/Typography";
import { ProtectedPage } from "#/contexts/auth";

import { styled } from "#/styling";

const StylePage = () => {
  return (
    <Stack css={{ px: "$4", py: "$5", gap: "$4" }}>
      <BrandTitle>Tournament of Power Rankings Demo</BrandTitle>

      <List>
        <Item>
          <Stack css={{ gap: "$3" }}>
            <CharacterName>Android 17!</CharacterName> (universe 7 - the best universe)
            <Image src="https://i.redd.it/l8bio0285hn51.jpg" />
          </Stack>
        </Item>

        <Item>
          <Stack css={{ gap: "$3" }}>
            <CharacterName>Goku</CharacterName>
            <Image src="https://www.comingsoon.net/assets/uploads/2021/05/dragon-ball.jpg" />
          </Stack>
        </Item>

        <Item>
          <Stack css={{ gap: "$3" }}>
            <CharacterName>Frieza</CharacterName>
            <Image src="https://otakukart.com/wp-content/uploads/2020/07/Frieza-with-the-Super-Dragon-Balls.jpg" />
          </Stack>
        </Item>

        <Item>
          <Stack css={{ gap: "$3" }}>
            <CharacterName>Android 18</CharacterName>
            <Image src="https://j4z6v9t7.rocketcdn.me/wp-content/uploads/2020/11/FIGURINE-ANDROID-18-GLITTER-AND-GLAMOURS-VER.B-DRAGON-BALL-Z-BANPRESTO-BANDAI.jpg.webp" />
          </Stack>
        </Item>
      </List>
    </Stack>
  );
};

const List = styled("ol", {
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "$4",
  pl: "$5",
});

const Item = styled("li", headingStyles, {});

const CharacterName = styled("a", {});

export default ProtectedPage(StylePage);
