'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

// 로컬라이저 설정
const localizer = momentLocalizer(moment);

interface ScheduleEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  memo?: string;
  isRaidEvent?: boolean;
  raidGroupId?: number;
  raidGroupName?: string;
}

interface PersonalSchedule {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  memo?: string;
}

interface RaidSchedule {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  memo?: string;
  raidGroupId: number;
  raidGroup: {
    name: string;
  };
}

interface RaidGroup {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  start: Date;
  end: Date;
  memo: string;
  isRaidEvent: boolean;
  raidGroupId: number | null;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [raidGroups, setRaidGroups] = useState<RaidGroup[]>([]);
  const [selectedRaidGroup, setSelectedRaidGroup] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const { toast } = useToast();

  // 폼 상태
  const [formData, setFormData] = useState<FormData>({
    title: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1시간 후
    memo: '',
    isRaidEvent: false,
    raidGroupId: null
  });

  // 일정 데이터 불러오기
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         // 개인 일정 가져오기
//         const personalResponse = await axios.get<PersonalSchedule[]>('/api/schedules');
        
//         // 레이드 일정 가져오기
//         const raidResponse = await axios.get<RaidSchedule[]>('/api/raid-schedules');
        
//         // 결합하여 표시
//         const personalEvents = personalResponse.data.map((event: PersonalSchedule) => ({
//           id: event.id,
//           title: event.title,
//           start: new Date(event.startTime),
//           end: new Date(event.endTime),
//           memo: event.memo,
//           isRaidEvent: false
//         }));
        
//         const raidEvents = raidResponse.data.map((event: RaidSchedule) => ({
//           id: event.id,
//           title: `[${event.raidGroup.name}] ${event.title}`,
//           start: new Date(event.startTime),
//           end: new Date(event.endTime),
//           memo: event.memo,
//           isRaidEvent: true,
//           raidGroupId: event.raidGroupId,
//           raidGroupName: event.raidGroup.name
//         }));
        
//         setEvents([...personalEvents, ...raidEvents]);
//       } catch (error) {
//         console.error('일정을 불러오는 중 오류가 발생했습니다:', error);
//         toast({
//           title: "일정 로드 실패",
//           description: "일정을 불러오는 중 오류가 발생했습니다.",
//           variant: "destructive"
//         });
//       }
//     };
    
//     const fetchRaidGroups = async () => {
//       try {
//         const response = await axios.get<RaidGroup[]>('/api/raid-groups/member');
//         setRaidGroups(response.data);
//       } catch (error) {
//         console.error('참여 중인 공격대 정보를 불러오는 중 오류가 발생했습니다:', error);
//       }
//     };
    
//     fetchEvents();
//     fetchRaidGroups();
//   }, [toast]);

  // 새 일정 등록 모달 열기
  const handleAddNewEvent = (slotInfo: SlotInfo) => {
    setIsNewEvent(true);
    setFormData({
      ...formData,
      start: slotInfo.start,
      end: slotInfo.end,
      title: '',
      memo: '',
      isRaidEvent: activeTab === 'raid',
      raidGroupId: selectedRaidGroup
    });
    setIsModalOpen(true);
  };

  // 기존 일정 클릭
  const handleSelectEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsNewEvent(false);
    setFormData({
      title: event.title,
      start: event.start,
      end: event.end,
      memo: event.memo || '',
      isRaidEvent: event.isRaidEvent || false,
      raidGroupId: event.raidGroupId || null
    });
    setIsModalOpen(true);
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    try {
      if (isNewEvent) {
        // 새 일정 생성
        if (formData.isRaidEvent && formData.raidGroupId) {
          // 레이드 일정
          await axios.post('/api/raid-schedules', {
            raidGroupId: formData.raidGroupId,
            title: formData.title,
            startTime: formData.start.toISOString(),
            endTime: formData.end.toISOString(),
            memo: formData.memo
          });
        } else {
          // 개인 일정
          await axios.post('/api/schedules', {
            title: formData.title,
            startTime: formData.start.toISOString(),
            endTime: formData.end.toISOString(),
            memo: formData.memo,
            visibility: isPublic ? 'public' : 'private'
          });
        }
        
        toast({
          title: "일정 생성 완료",
          description: "새 일정이 성공적으로 생성되었습니다.",
        });
      } else if (selectedEvent) {
        // 기존 일정 수정
        if (selectedEvent.isRaidEvent) {
          // 레이드 일정
          await axios.put(`/api/raid-schedules/${selectedEvent.id}`, {
            title: formData.title,
            startTime: formData.start.toISOString(),
            endTime: formData.end.toISOString(),
            memo: formData.memo
          });
        } else {
          // 개인 일정
          await axios.put(`/api/schedules/${selectedEvent.id}`, {
            title: formData.title,
            startTime: formData.start.toISOString(),
            endTime: formData.end.toISOString(),
            memo: formData.memo,
            visibility: isPublic ? 'public' : 'private'
          });
        }
        
        toast({
          title: "일정 수정 완료",
          description: "일정이 성공적으로 수정되었습니다.",
        });
      }
      
      // 모달 닫고 일정 다시 불러오기
      setIsModalOpen(false);
      
      // 일정 다시 불러오기
      const personalResponse = await axios.get<PersonalSchedule[]>('/api/schedules');
      const raidResponse = await axios.get<RaidSchedule[]>('/api/raid-schedules');
      
      const personalEvents = personalResponse.data.map((event: PersonalSchedule) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        memo: event.memo,
        isRaidEvent: false
      }));
      
      const raidEvents = raidResponse.data.map((event: RaidSchedule) => ({
        id: event.id,
        title: `[${event.raidGroup.name}] ${event.title}`,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        memo: event.memo,
        isRaidEvent: true,
        raidGroupId: event.raidGroupId,
        raidGroupName: event.raidGroup.name
      }));
      
      setEvents([...personalEvents, ...raidEvents]);
      
    } catch (error) {
      console.error('일정 저장 중 오류가 발생했습니다:', error);
      toast({
        title: "일정 저장 실패",
        description: "일정을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 일정 삭제 처리
  const handleDelete = async () => {
    if (!selectedEvent) return;
    
    try {
      if (selectedEvent.isRaidEvent) {
        await axios.delete(`/api/raid-schedules/${selectedEvent.id}`);
      } else {
        await axios.delete(`/api/schedules/${selectedEvent.id}`);
      }
      
      toast({
        title: "일정 삭제 완료",
        description: "일정이 성공적으로 삭제되었습니다.",
      });
      
      // 모달 닫기
      setIsModalOpen(false);
      
      // 일정 목록에서 삭제된 일정 제거
      setEvents(events.filter(event => !(event.id === selectedEvent.id && event.isRaidEvent === selectedEvent.isRaidEvent)));
      
    } catch (error) {
      console.error('일정 삭제 중 오류가 발생했습니다:', error);
      toast({
        title: "일정 삭제 실패",
        description: "일정을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 탭 변경 시
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData({
      ...formData,
      isRaidEvent: value === 'raid'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">일정 관리</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              setActiveTab('personal');
              handleAddNewEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 60 * 60 * 1000),
                slots: [],
                action: 'click',
                bounds: {
                  x: 0,
                  y: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                },
                box: {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0,
                }
              });
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            개인 일정 추가
          </Button>
          <Button 
            onClick={() => {
              setActiveTab('raid');
              handleAddNewEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 60 * 60 * 1000),
                slots: [],
                action: 'click',
                bounds: {
                  x: 0,
                  y: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                },
                box: {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0,
                }
              });
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            레이드 일정 추가
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleAddNewEvent}
          onSelectEvent={handleSelectEvent}
          style={{ height: 'calc(100vh - 250px)' }}
          eventPropGetter={(event: ScheduleEvent) => {
            const backgroundColor = event.isRaidEvent ? '#9333ea' : '#2563eb';
            return { style: { backgroundColor } };
          }}
          views={['month', 'week', 'day']}
          messages={{
            next: "다음",
            previous: "이전",
            today: "오늘",
            month: "월",
            week: "주",
            day: "일"
          }}
          className="rounded-lg"
        />
      </div>

      {/* 일정 추가/수정 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isNewEvent ? '새 일정 추가' : '일정 상세'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">개인 일정</TabsTrigger>
              <TabsTrigger value="raid">레이드 일정</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  placeholder="일정 제목을 입력하세요"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">시작 시간</Label>
                  <Input
                    id="start-date"
                    type="datetime-local"
                    value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, start: new Date(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">종료 시간</Label>
                  <Input
                    id="end-date"
                    type="datetime-local"
                    value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, end: new Date(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memo">메모</Label>
                <Textarea
                  id="memo"
                  value={formData.memo}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, memo: e.target.value})}
                  placeholder="일정에 대한 메모를 남겨보세요"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public">공개 일정으로 설정</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="raid" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="raid-group">공격대 선택</Label>
                <Select
                  value={selectedRaidGroup?.toString() || ''}
                  onValueChange={(value: string) => {
                    setSelectedRaidGroup(Number(value));
                    setFormData({...formData, raidGroupId: Number(value)});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="참여 중인 공격대 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {raidGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="raid-title">레이드 제목</Label>
                <Input
                  id="raid-title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  placeholder="레이드 일정 제목을 입력하세요"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="raid-start-date">시작 시간</Label>
                  <Input
                    id="raid-start-date"
                    type="datetime-local"
                    value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, start: new Date(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raid-end-date">종료 시간</Label>
                  <Input
                    id="raid-end-date"
                    type="datetime-local"
                    value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, end: new Date(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="raid-memo">메모</Label>
                <Textarea
                  id="raid-memo"
                  value={formData.memo}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, memo: e.target.value})}
                  placeholder="레이드 일정에 대한 메모를 남겨보세요"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            {!isNewEvent && (
              <Button variant="destructive" onClick={handleDelete}>
                삭제
              </Button>
            )}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmit}>
                {isNewEvent ? '추가' : '수정'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}