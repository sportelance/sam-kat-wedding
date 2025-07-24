// Guest list with name variations
export const guestList = {
    'joe': ['Joe', 'Patty', 'Grace'],
    'joey': ['Joe', 'Patty', 'Grace'],
    'joseph': ['Joe', 'Patty', 'Grace'],
    'patty': ['Joe', 'Patty', 'Grace'],
    'grace': ['Joe', 'Patty', 'Grace'],
    'matt': ['Matt', 'Isabella'],
    'matthew': ['Matt', 'Isabella'],
    'isabella': ['Matt', 'Isabella'],
    'bella': ['Matt', 'Isabella'],
    'tom': ['Tom', 'Natalie'],
    'thomas': ['Tom', 'Natalie'],
    'natalie': ['Tom', 'Natalie'],
    'justin': ['Justin', 'Samantha'],
    'sam': ['Justin', 'Samantha'],
    'samantha': ['Justin', 'Samantha'],
    'eileen': ['Eileen', 'Rich', 'Paul'],
    'rich': ['Eileen', 'Rich', 'Paul'],
    'richard': ['Eileen', 'Rich', 'Paul'],
    'paul': ['Eileen', 'Rich', 'Paul'],
    'abi': ['Abi'],
    'abigail': ['Abi'],
    'desiree': ['Desiree'],
    'desi': ['Desiree'],
    'greg': ['Greg', 'Keith'],
    'gregory': ['Greg', 'Keith'],
    'keith': ['Greg', 'Keith'],
    'brian': ['Brian'],
    'preston': ['Preston'],
    'maddy': ['Maddy', 'Chris', 'John'],
    'madeline': ['Maddy', 'Chris', 'John'],
    'chris': ['Maddy', 'Chris', 'John'],
    'john': ['Maddy', 'Chris', 'John'],
    'johnny': ['Maddy', 'Chris', 'John'],
    'tushar': ['Tushar', 'Christopher'],
    'tush': ['Tushar', 'Christopher'],
    'christopher': ['Tushar', 'Christopher'],
    'cole': ['Cole', 'Cayla'],
    'cayla': ['Cole', 'Cayla'],
    'josephine': ['Josephine', 'Austin'],
    'feen': ['Josephine', 'Austin'],
    'austin': ['Josephine', 'Austin'],
    'ally': ['Ally'],
    'dick': ['Dick', 'Pam'],
    'pamela': ['Dick', 'Pam'],
    'pam': ['Dick', 'Pam'],
    'samuel': ['Sam', 'Kat'],
    'kat': ['Sam', 'Kat']
};

export const EMAILJS_CONFIG = {
    publicKey: 'CoQOIcjZNBGJm0B4e',
    serviceId: 'service_iqw111p',
    templateId: 'template_19ojfhn'
};

export function formatGuestList(guests) {
    if (!guests || guests.length === 0) return '';
    if (guests.length === 1) return guests[0];
    if (guests.length === 2) return `${guests[0]} and ${guests[1]}`;
    // Oxford comma for 3 or more
    return `${guests.slice(0, -1).join(', ')}, and ${guests[guests.length - 1]}`;
} 

export function getCurrentGuest() {
    const savedGuest = localStorage.getItem('currentGuest');
    return savedGuest ? JSON.parse(savedGuest) : null;
}