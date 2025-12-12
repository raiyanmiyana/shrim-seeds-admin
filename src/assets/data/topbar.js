import { addOrSubtractDaysFromDate, addOrSubtractMinutesFromDate } from '@/utils/date';

export const notifications = [{
  title: 'Caleb Flakelar commented on Admin',
  time: addOrSubtractMinutesFromDate(1),
  icon: {
    icon: 'mdi:account'
  },
  variant: 'primary'
}, {
  title: 'New user registered.',
  time: addOrSubtractMinutesFromDate(300),
  icon: {
    icon: 'mdi:account-plus'
  },
  variant: 'warning'
}, {
  title: 'Carlos Crouch liked',
  time: addOrSubtractDaysFromDate(3),
  icon: {
    icon: 'mdi:heart'
  },
  variant: 'danger'
}, {
  title: 'Caleb Flakelar commented on Admi',
  time: addOrSubtractDaysFromDate(4),
  icon: {
    icon: 'mdi:account-box'
  },
  variant: 'pink'
}, {
  title: 'New user registered.',
  time: addOrSubtractDaysFromDate(7),
  icon: {
    icon: 'mdi:account-plus'
  },
  variant: 'purple'
}, {
  title: 'Carlos Crouch liked Admin.',
  time: addOrSubtractDaysFromDate(8),
  icon: {
    icon: 'mdi:account-plus'
  },
  variant: 'success'
}];