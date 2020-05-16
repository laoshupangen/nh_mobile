const hSpacing = '20px'

export default {
  themeStyles: {
    wrapper: {
      border: '0',
    },
    header: {
      padding: `20px ${hSpacing}`,
      
    },
    headerTitle: {
      fontSize: '.45rem'
    },
    headerHorizontalDivider: {
      borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
      width: '80%',
    },
    weekdays: {
      padding: `20px ${hSpacing} 10px ${hSpacing}`,
      color: '#676767',
      borderBottom: '1px solid #EFEFEF',
      fontSize: '.5rem'
    },
    dayCell: {
      padding: '.25rem'
    },
    weeks: {
      padding: `0 ${hSpacing} ${hSpacing} ${hSpacing}`,
      color: '#acacac'
    },
    dayContent: {
      width: '.45rem',
      height: '.45rem',
      fontSize: '.45rem'
    },
    dayPopoverContent: {
      fontSize: '.38rem'
    }
  },
}