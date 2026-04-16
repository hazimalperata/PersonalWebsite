'use client';

import {
  AvatarGroup,
  Badge,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from '@once-ui-system/core';
import { Status } from '@/utils/utils';

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  status: Status;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  status,
}) => {
  return (
    <Column fillWidth gap="m">
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={images.map((image) => ({
          slide: image,
          alt: title,
        }))}
      />
      <Flex
        s={{ direction: 'column' }}
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        <Column flex={7} gap="16">
          {title && (
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
          )}

          {status === 'Completed' ? (
            // "neutral" | "brand" | "accent" | "info" | "danger" | "warning" | "success"
            <Badge
              border="success-medium"
              title="Completed"
              icon="completed"
              arrow={false}
              effect={false}
              paddingLeft="12"
              paddingRight="16"
              paddingY="8"
              onBackground="success-medium"
              background="success-medium"
            />
          ) : status === 'InProgress' ? (
            <Badge
              title="In Progress"
              icon="inProgress"
              arrow={false}
              paddingLeft="12"
              paddingRight="16"
              paddingY="8"
              onBackground="brand-medium"
              background="brand-medium"
            />
          ) : (
            <Badge
              border="info-medium"
              title="Planned"
              icon="calendar"
              effect={false}
              paddingLeft="12"
              paddingRight="16"
              paddingY="8"
              onBackground="info-medium"
              background="info-medium"
            />
          )}
        </Column>

        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && (
              <AvatarGroup avatars={avatars} size="m" reverse />
            )}
            {description?.trim() && (
              <Text
                wrap="balance"
                variant="body-default-s"
                onBackground="neutral-weak"
              >
                {description}
              </Text>
            )}
            <Flex gap="24" wrap>
              {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: '0', width: 'fit-content' }}
                  href={href}
                >
                  <Text variant="body-default-s">Read case study</Text>
                </SmartLink>
              )}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: '0', width: 'fit-content' }}
                  href={link}
                >
                  <Text variant="body-default-s">View project</Text>
                </SmartLink>
              )}
            </Flex>
          </Column>
        )}
      </Flex>
    </Column>
  );
};
