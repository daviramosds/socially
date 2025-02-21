import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function GenerateUsers() {
  // Cria 10 usuários
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          clerkId: faker.string.uuid(),
          name: faker.person.fullName(),
          bio: faker.lorem.sentence(),
          image: faker.image.avatar(),
          location: faker.location.city(),
          website: faker.internet.url(),
        },
      });
    })
  );

  // Para cada usuário, cria de 1 a 5 postagens
  const posts = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() =>
        prisma.post.create({
          data: {
            authorId: user.id,
            content: faker.lorem.paragraph(),
            image: faker.datatype.boolean()
              ? `https://picsum.photos/seed/${faker.string.uuid()}/600/400`
              : null,
          },
        })
      )
    )
  );

  // Cria seguidores aleatórios
  await Promise.all(
    users.map((follower) => {
      const following = users
        .filter((user) => user.id !== follower.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, faker.number.int({ min: 0, max: 3 }));

      return Promise.all(
        following.map((followed) =>
          prisma.follows.create({
            data: {
              followerId: follower.id,
              followingId: followed.id,
            },
          })
        )
      );
    })
  );

  // Cada usuário curte de 1 a 5 postagens aleatórias
  await Promise.all(
    users.map((user) => {
      const likedPosts = posts.sort(() => 0.5 - Math.random()).slice(0, faker.number.int({ min: 1, max: 5 }));

      return Promise.all(
        likedPosts.map((post) =>
          prisma.like.create({
            data: {
              userId: user.id,
              postId: post.id,
            },
          })
        )
      );
    })
  );

  // Cada usuário comenta em 1 a 3 postagens aleatórias
  await Promise.all(
    users.map((user) => {
      const commentedPosts = posts.sort(() => 0.5 - Math.random()).slice(0, faker.number.int({ min: 1, max: 3 }));

      return Promise.all(
        commentedPosts.map((post) =>
          prisma.comment.create({
            data: {
              authorId: user.id,
              postId: post.id,
              content: faker.lorem.sentence(),
            },
          })
        )
      );
    })
  );
}