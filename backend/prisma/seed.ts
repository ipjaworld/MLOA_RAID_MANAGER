import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 정리
  await prisma.aiChatLog.deleteMany();
  await prisma.raidSchedule.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.raidMembership.deleteMany();
  await prisma.raidGroup.deleteMany();
  await prisma.character.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 기존 데이터를 정리했습니다.');

  // 사용자 데이터 생성
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'darkblade@example.com',
      nickname: '칼바람장미',
      password: hashedPassword,
      loginType: 'default',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'supportmain@example.com',
      nickname: '힐러주세요',
      password: hashedPassword,
      loginType: 'default',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'arcana@example.com',
      nickname: '운빨캐리',
      password: hashedPassword,
      loginType: 'default',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'raidleader@example.com',
      nickname: '강습킹',
      password: hashedPassword,
      loginType: 'default',
    },
  });

  console.log('👤 사용자를 생성했습니다:', { user1, user2, user3, user4 });

  // 캐릭터 데이터 생성
  const character1 = await prisma.character.create({
    data: {
      userId: user1.id,
      name: '블레이드장인',
      job: '블레이드',
      itemLevel: 1730.55,
      isRepresentative: true,
    },
  });

  const character2 = await prisma.character.create({
    data: {
      userId: user1.id,
      name: '데모닉부계',
      job: '데모닉',
      itemLevel: 1705.33,
      isRepresentative: false,
    },
  });

  const character3 = await prisma.character.create({
    data: {
      userId: user2.id,
      name: '바드는사랑',
      job: '바드',
      itemLevel: 1745.88,
      isRepresentative: true,
    },
  });

  const character4 = await prisma.character.create({
    data: {
      userId: user2.id,
      name: '도화가키우는중',
      job: '도화가',
      itemLevel: 1692.75,
      isRepresentative: false,
    },
  });

  const character5 = await prisma.character.create({
    data: {
      userId: user3.id,
      name: '아르카나짱',
      job: '아르카나',
      itemLevel: 1725.5,
      isRepresentative: true,
    },
  });

  const character6 = await prisma.character.create({
    data: {
      userId: user3.id,
      name: '창술이쁘다',
      job: '창술사',
      itemLevel: 1685.25,
      isRepresentative: false,
    },
  });

  const character7 = await prisma.character.create({
    data: {
      userId: user4.id,
      name: '건슬링거킬러',
      job: '건슬링거',
      itemLevel: 1755.67,
      isRepresentative: true,
    },
  });

  const character8 = await prisma.character.create({
    data: {
      userId: user4.id,
      name: '기상술사연습중',
      job: '기상술사',
      itemLevel: 1710.42,
      isRepresentative: false,
    },
  });

  console.log('👾 캐릭터를 생성했습니다:', {
    character1,
    character2,
    character3,
    character4,
    character5,
    character6,
    character7,
    character8,
  });

  // 공격대 그룹 생성
  const raidGroup1 = await prisma.raidGroup.create({
    data: {
      name: '모르둠 하드 클리어 공격대',
      description: '하드 3막 풀클 목표, 경험자만 신청 가능, 주 3회 진행',
      leaderId: user4.id,
      isPublic: true,
    },
  });

  const raidGroup2 = await prisma.raidGroup.create({
    data: {
      name: '강습 하드 트라이팟',
      description: '강습 하드 비기닝~엔딩 공략중, 인성 좋은 사람만',
      leaderId: user1.id,
      isPublic: true,
    },
  });

  const raidGroup3 = await prisma.raidGroup.create({
    data: {
      name: '아브렐슈드 제2막 풀클',
      description: '하드 2막 정기 숙제팟, 목요일 21시 고정',
      leaderId: user3.id,
      isPublic: false,
    },
  });

  const raidGroup4 = await prisma.raidGroup.create({
    data: {
      name: '에기르 주간 품앗이',
      description: '본/부 교차 레이드, 1캐릭당 주 1회 참여 필수',
      leaderId: user2.id,
      isPublic: true,
    },
  });

  console.log('🏆 공격대 그룹을 생성했습니다:', {
    raidGroup1,
    raidGroup2,
    raidGroup3,
    raidGroup4,
  });

  // 공격대 멤버십 생성
  // 그룹 1 멤버십
  const membership1 = await prisma.raidMembership.create({
    data: {
      userId: user4.id,
      raidGroupId: raidGroup1.id,
      role: 'leader',
    },
  });

  const membership2 = await prisma.raidMembership.create({
    data: {
      userId: user1.id,
      raidGroupId: raidGroup1.id,
      role: 'member',
    },
  });

  const membership3 = await prisma.raidMembership.create({
    data: {
      userId: user2.id,
      raidGroupId: raidGroup1.id,
      role: 'member',
    },
  });

  // 그룹 2 멤버십
  const membership4 = await prisma.raidMembership.create({
    data: {
      userId: user1.id,
      raidGroupId: raidGroup2.id,
      role: 'leader',
    },
  });

  const membership5 = await prisma.raidMembership.create({
    data: {
      userId: user3.id,
      raidGroupId: raidGroup2.id,
      role: 'member',
    },
  });

  // 그룹 3 멤버십
  const membership6 = await prisma.raidMembership.create({
    data: {
      userId: user3.id,
      raidGroupId: raidGroup3.id,
      role: 'leader',
    },
  });

  const membership7 = await prisma.raidMembership.create({
    data: {
      userId: user2.id,
      raidGroupId: raidGroup3.id,
      role: 'member',
    },
  });

  // 그룹 4 멤버십
  const membership8 = await prisma.raidMembership.create({
    data: {
      userId: user2.id,
      raidGroupId: raidGroup4.id,
      role: 'leader',
    },
  });

  const membership9 = await prisma.raidMembership.create({
    data: {
      userId: user4.id,
      raidGroupId: raidGroup4.id,
      role: 'member',
    },
  });

  console.log('🤝 공격대 멤버십을 생성했습니다:', {
    membership1,
    membership2,
    membership3,
    membership4,
    membership5,
    membership6,
    membership7,
    membership8,
    membership9,
  });

  // 개인 일정 생성
  const now = new Date();

  // 내일
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(20, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(tomorrowEnd.getHours() + 3);

  // 이틀 후
  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(19, 30, 0, 0);

  const dayAfterTomorrowEnd = new Date(dayAfterTomorrow);
  dayAfterTomorrowEnd.setHours(dayAfterTomorrowEnd.getHours() + 2);

  const schedule1 = await prisma.schedule.create({
    data: {
      userId: user1.id,
      title: '개인 강습 공략 연습',
      memo: '솔플로 강습 패턴 연습하기',
      startTime: tomorrow,
      endTime: tomorrowEnd,
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      userId: user2.id,
      title: '정기 휴식일',
      memo: '다른 게임 플레이 예정',
      startTime: dayAfterTomorrow,
      endTime: dayAfterTomorrowEnd,
    },
  });

  console.log('📅 개인 일정을 생성했습니다:', { schedule1, schedule2 });

  // 공격대 일정 생성
  // 이번주 목요일
  const thisThursday = new Date(now);
  thisThursday.setDate(
    thisThursday.getDate() + ((4 + 7 - thisThursday.getDay()) % 7),
  );
  thisThursday.setHours(21, 0, 0, 0);

  const thisThursdayEnd = new Date(thisThursday);
  thisThursdayEnd.setHours(thisThursdayEnd.getHours() + 3);

  // 이번주 토요일
  const thisSaturday = new Date(now);
  thisSaturday.setDate(
    thisSaturday.getDate() + ((6 + 7 - thisSaturday.getDay()) % 7),
  );
  thisSaturday.setHours(14, 0, 0, 0);

  const thisSaturdayEnd = new Date(thisSaturday);
  thisSaturdayEnd.setHours(thisSaturdayEnd.getHours() + 4);

  // 이번주 일요일
  const thisSunday = new Date(now);
  thisSunday.setDate(
    thisSunday.getDate() + ((0 + 7 - thisSunday.getDay()) % 7),
  );
  thisSunday.setHours(20, 0, 0, 0);

  const thisSundayEnd = new Date(thisSunday);
  thisSundayEnd.setHours(thisSundayEnd.getHours() + 3);

  const raidSchedule1 = await prisma.raidSchedule.create({
    data: {
      raidGroupId: raidGroup1.id,
      title: '모르둠 하드 3막 주간 레이드',
      memo: '출발 10분 전까지 디코 접속 필수',
      startTime: thisThursday,
      endTime: thisThursdayEnd,
    },
  });

  const raidSchedule2 = await prisma.raidSchedule.create({
    data: {
      raidGroupId: raidGroup2.id,
      title: '강습 하드 8단계 집중 공략',
      memo: '8단계 패턴 연습 후 트라이, 마석/물약 필참',
      startTime: thisSaturday,
      endTime: thisSaturdayEnd,
    },
  });

  const raidSchedule3 = await prisma.raidSchedule.create({
    data: {
      raidGroupId: raidGroup3.id,
      title: '정기 아브렐슈드 하드 2막',
      memo: '클리어 목표, 1시간내 클리어 못할 시 다음주 진행',
      startTime: thisSunday,
      endTime: thisSundayEnd,
    },
  });

  console.log('📅 공격대 일정을 생성했습니다:', {
    raidSchedule1,
    raidSchedule2,
    raidSchedule3,
  });

  // AI 채팅 로그 생성
  const chatLog1 = await prisma.aiChatLog.create({
    data: {
      userId: user1.id,
      message: '모르둠 하드 3막 3지파 패턴을 알려줘',
      response:
        '모르둠 하드 3막 3지파는 다음 단계로 진행됩니다:\n\n1. 충전 단계: 모든 플레이어는 지정된 위치에서 패턴을 처리하며 정령을 충전해야 합니다.\n2. 거미 처리: 각자 담당 위치의 거미를 처리하세요.\n3. 무력화: 보스가 무력화 패턴을 시전할 때 모든 딜러는 무력화에 집중해야 합니다.\n4. 카운터: 카운터 담당자는 보스의 푸른 빛 패턴에 대비해야 합니다.\n5. 폭발 회피: 바닥에 생기는 빨간 원을 피해 안전 지대로 이동하세요.',
    },
  });

  const chatLog2 = await prisma.aiChatLog.create({
    data: {
      userId: user3.id,
      message: '아르카나 카드 운용법 좀 알려줘',
      response:
        '아르카나의 효과적인 카드 운용을 위한 팁입니다:\n\n1. 카드 세트 관리: 황금, 적색, 청색 카드를 우선적으로 모으세요.\n2. 클래스 특화: 특화 스탯을 높여 카드 데미지를 극대화하세요.\n3. 황금 카드 활용: 황금 카드는 바로 사용하기보다 적절한 타이밍에 사용하세요.\n4. 스택 관리: 카드 스택을 최대한 유지하면서 황금 카드를 모으는 운용법이 효과적입니다.\n5. 밸런스 스킬 활용: 밸런스 스킬과 카드 스킬의 조합으로 데미지를 최적화하세요.\n6. 버스트 타이밍: 중요 패턴에서 카드를 모두 소모하는 버스트 타이밍을 잘 잡는 것이 중요합니다.',
    },
  });

  console.log('💬 AI 채팅 로그를 생성했습니다:', {
    chatLog1,
    chatLog2,
  });

  console.log('✅ 시드 데이터 생성이 완료되었습니다!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
