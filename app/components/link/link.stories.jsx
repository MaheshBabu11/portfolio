import { Link } from '~/components/link';
import { StoryContainer } from '../../../.storybook/story-container';

export default {
  title: 'Link',
};

export const Default = () => (
  <StoryContainer style={{ fontSize: 18 }}>
    <Link href="https://maheshbabu11.dev">Primary link</Link>
    <Link secondary href="https://maheshbabu11.dev">
      Secondary link
    </Link>
  </StoryContainer>
);
