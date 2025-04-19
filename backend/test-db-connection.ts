import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // DB 연결 테스트
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공!');

    // 간단한 쿼리 실행 테스트
    const userCount = await prisma.user.count();
    console.log(`현재 사용자 수: ${userCount}`);

    // 모든 테이블의 레코드 수 확인
    const characterCount = await prisma.character.count();
    const raidGroupCount = await prisma.raidGroup.count();
    const raidMembershipCount = await prisma.raidMembership.count();
    const scheduleCount = await prisma.schedule.count();
    const raidScheduleCount = await prisma.raidSchedule.count();
    const chatLogCount = await prisma.aiChatLog.count();

    console.log('📊 DB 테이블 상태:');
    console.log(`- User: ${userCount}개 레코드`);
    console.log(`- Character: ${characterCount}개 레코드`);
    console.log(`- RaidGroup: ${raidGroupCount}개 레코드`);
    console.log(`- RaidMembership: ${raidMembershipCount}개 레코드`);
    console.log(`- Schedule: ${scheduleCount}개 레코드`);
    console.log(`- RaidSchedule: ${raidScheduleCount}개 레코드`);
    console.log(`- AiChatLog: ${chatLogCount}개 레코드`);

    // 간단한 관계 조회 테스트 (예: 첫 번째 사용자의 캐릭터 목록)
    if (userCount > 0) {
      const firstUser = await prisma.user.findFirst({
        include: {
          characters: true,
        },
      });

      console.log('\n👤 첫 번째 사용자 정보:');
      console.log(`- ID: ${firstUser?.id}`);
      console.log(`- 이메일: ${firstUser?.email}`);
      console.log(`- 닉네임: ${firstUser?.nickname}`);
      console.log(`- 보유 캐릭터 수: ${firstUser?.characters.length}개`);

      if (firstUser?.characters.length) {
        console.log('\n🎮 캐릭터 목록:');
        firstUser?.characters.forEach((char, idx) => {
          console.log(
            `${idx + 1}. ${char.name} (${char.job}) - 아이템 레벨: ${
              char.itemLevel
            }`,
          );
        });
      }
    }
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
