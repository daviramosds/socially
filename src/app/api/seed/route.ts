import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Limpa dados existentes para evitar duplicações
    await prisma.notification.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.follows.deleteMany();
    await prisma.user.deleteMany();

    // Criação de 10 usuários com dados aleatórios
    const users = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        prisma.user.create({
          data: {
            email: faker.internet.email(),
            username: faker.internet.username(),
            clerkId: faker.string.uuid(),
            name: faker.person.fullName(),
            bio: faker.lorem.sentence(),
            image: faker.image.avatar(),
            location: faker.location.city(),
            website: faker.internet.url(),
          },
        })
      )
    );

    // Criação de posts (1 a 5 posts por usuário)
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

    // Seguidores aleatórios (cada usuário segue até 3 outros usuários)
    await Promise.all(
      users.map((user) => {
        const others = users.filter((u) => u.id !== user.id);
        const following = faker.helpers.arrayElements(others, faker.number.int({ min: 0, max: 3 }));
        return Promise.all(
          following.map((followed) =>
            prisma.follows.create({
              data: {
                followerId: user.id,
                followingId: followed.id,
              },
            })
          )
        );
      })
    );

    // Curtidas aleatórias (cada usuário curte até 5 posts)
    await Promise.all(
      users.flatMap((user) => {
        const likedPosts = faker.helpers.arrayElements(posts, faker.number.int({ min: 1, max: 5 }));
        return likedPosts.map((post) =>
          prisma.like.create({
            data: {
              userId: user.id,
              postId: post.id,
            },
          })
        );
      })
    );

    // Comentários aleatórios (cada usuário comenta em até 3 posts)
    await Promise.all(
      users.flatMap((user) => {
        const commentedPosts = faker.helpers.arrayElements(posts, faker.number.int({ min: 1, max: 3 }));
        return commentedPosts.map((post) =>
          prisma.comment.create({
            data: {
              authorId: user.id,
              postId: post.id,
              content: faker.lorem.sentence(),
            },
          })
        );
      })
    );

    return NextResponse.json({ message: '10 usuários com posts, curtidas e comentários criados com sucesso!' });
  } catch (error) {
    console.error('Erro ao gerar seed:', error);
    return NextResponse.json({ message: 'Erro ao gerar seed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
