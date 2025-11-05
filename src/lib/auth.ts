/**
 * Authentication utilities with secure password hashing
 */

/**
 * Generate a random salt for password hashing
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password using SHA-256 with salt
 * Note: For production, use bcrypt on backend. This is client-side only solution.
 */
export async function hashPassword(password: string, salt?: string): Promise<string> {
  // If no salt provided, generate a new one
  const useSalt = salt || generateSalt();
  
  // Combine password with salt
  const saltedPassword = password + useSalt;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(saltedPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return hash with salt appended (separated by :)
  return `${hashHex}:${useSalt}`;
}

/**
 * Verify password against stored hash with salt
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Extract salt from stored hash
    const [hash, salt] = storedHash.split(':');
    
    if (!salt) {
      // Old format without salt - for backward compatibility
      const passwordHash = await hashPasswordWithoutSalt(password);
      return passwordHash === storedHash;
    }
    
    // Hash the input password with the stored salt
    const passwordHashWithSalt = await hashPassword(password, salt);
    
    // Compare the full hash:salt strings
    return passwordHashWithSalt === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Legacy hash function without salt (for backward compatibility)
 */
async function hashPasswordWithoutSalt(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Auth storage keys
 */
const AUTH_KEYS = {
  EMAIL: 'admin_email',
  PASSWORD_HASH: 'admin_password_hash',
  SESSION: 'admin_authenticated',
  SESSION_EXPIRY: 'admin_session_expiry',
  FAILED_ATTEMPTS: 'admin_failed_attempts',
  LOCKOUT_UNTIL: 'admin_lockout_until',
} as const;

/**
 * Security configuration
 */
const SECURITY_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Initialize admin credentials on first run
 */
export async function initializeAdminCredentials(email: string, password: string): Promise<void> {
  const hash = await hashPassword(password);
  localStorage.setItem(AUTH_KEYS.EMAIL, email);
  localStorage.setItem(AUTH_KEYS.PASSWORD_HASH, hash);
}

/**
 * Check if admin credentials are set
 */
export function isCredentialsSet(): boolean {
  return localStorage.getItem(AUTH_KEYS.EMAIL) !== null && 
         localStorage.getItem(AUTH_KEYS.PASSWORD_HASH) !== null;
}

/**
 * Get stored email
 */
export function getStoredEmail(): string | null {
  return localStorage.getItem(AUTH_KEYS.EMAIL);
}

/**
 * Get stored password hash (for setup check only)
 */
export function getPasswordHash(): string | null {
  return localStorage.getItem(AUTH_KEYS.PASSWORD_HASH);
}

/**
 * Check if account is locked due to failed attempts
 */
export function isAccountLocked(): { locked: boolean; remainingTime?: number } {
  const lockoutUntil = localStorage.getItem(AUTH_KEYS.LOCKOUT_UNTIL);
  
  if (!lockoutUntil) {
    return { locked: false };
  }

  const lockoutTime = parseInt(lockoutUntil);
  const now = Date.now();

  if (now < lockoutTime) {
    const remainingTime = Math.ceil((lockoutTime - now) / 1000 / 60); // minutes
    return { locked: true, remainingTime };
  }

  // Lockout expired, clear it
  localStorage.removeItem(AUTH_KEYS.LOCKOUT_UNTIL);
  localStorage.removeItem(AUTH_KEYS.FAILED_ATTEMPTS);
  return { locked: false };
}

/**
 * Record failed login attempt
 */
function recordFailedAttempt(): void {
  const attempts = parseInt(localStorage.getItem(AUTH_KEYS.FAILED_ATTEMPTS) || '0');
  const newAttempts = attempts + 1;
  
  localStorage.setItem(AUTH_KEYS.FAILED_ATTEMPTS, newAttempts.toString());

  if (newAttempts >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS) {
    const lockoutUntil = Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION;
    localStorage.setItem(AUTH_KEYS.LOCKOUT_UNTIL, lockoutUntil.toString());
  }
}

/**
 * Clear failed attempts on successful login
 */
function clearFailedAttempts(): void {
  localStorage.removeItem(AUTH_KEYS.FAILED_ATTEMPTS);
  localStorage.removeItem(AUTH_KEYS.LOCKOUT_UNTIL);
}

/**
 * Get remaining failed attempts before lockout
 */
export function getRemainingAttempts(): number {
  const attempts = parseInt(localStorage.getItem(AUTH_KEYS.FAILED_ATTEMPTS) || '0');
  return Math.max(0, SECURITY_CONFIG.MAX_FAILED_ATTEMPTS - attempts);
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  // Check if account is locked
  const lockStatus = isAccountLocked();
  if (lockStatus.locked) {
    return {
      success: false,
      error: `Tài khoản bị khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau ${lockStatus.remainingTime} phút.`,
    };
  }

  // Get stored credentials
  const storedEmail = getStoredEmail();
  const storedHash = getPasswordHash();
  
  if (!storedEmail || !storedHash) {
    return {
      success: false,
      error: 'Chưa thiết lập tài khoản admin. Vui lòng liên hệ quản trị viên.',
    };
  }

  // Verify email
  if (email !== storedEmail) {
    recordFailedAttempt();
    const remaining = getRemainingAttempts();
    
    return {
      success: false,
      error: remaining > 0
        ? `Email hoặc mật khẩu không đúng! Còn ${remaining} lần thử.`
        : `Email hoặc mật khẩu không đúng! Tài khoản sẽ bị khóa ${SECURITY_CONFIG.LOCKOUT_DURATION / 60000} phút.`,
    };
  }

  // Verify password
  const isValid = await verifyPassword(password, storedHash);

  if (!isValid) {
    recordFailedAttempt();
    const remaining = getRemainingAttempts();
    
    return {
      success: false,
      error: remaining > 0
        ? `Email hoặc mật khẩu không đúng! Còn ${remaining} lần thử.`
        : `Email hoặc mật khẩu không đúng! Tài khoản sẽ bị khóa ${SECURITY_CONFIG.LOCKOUT_DURATION / 60000} phút.`,
    };
  }

  // Success - clear failed attempts and create session
  clearFailedAttempts();
  const sessionExpiry = Date.now() + SECURITY_CONFIG.SESSION_DURATION;
  localStorage.setItem(AUTH_KEYS.SESSION, 'true');
  localStorage.setItem(AUTH_KEYS.SESSION_EXPIRY, sessionExpiry.toString());

  return { success: true };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const session = localStorage.getItem(AUTH_KEYS.SESSION);
  const expiry = localStorage.getItem(AUTH_KEYS.SESSION_EXPIRY);

  if (!session || !expiry) {
    return false;
  }

  const expiryTime = parseInt(expiry);
  const now = Date.now();

  if (now > expiryTime) {
    // Session expired
    logout();
    return false;
  }

  return true;
}

/**
 * Logout
 */
export function logout(): void {
  localStorage.removeItem(AUTH_KEYS.SESSION);
  localStorage.removeItem(AUTH_KEYS.SESSION_EXPIRY);
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  // Verify current password
  const storedHash = getPasswordHash();
  if (!storedHash) {
    return {
      success: false,
      error: 'Không tìm thấy mật khẩu hiện tại.',
    };
  }

  const isValid = await verifyPassword(currentPassword, storedHash);
  if (!isValid) {
    return {
      success: false,
      error: 'Mật khẩu hiện tại không đúng!',
    };
  }

  // Validate new password
  if (newPassword.length < 8) {
    return {
      success: false,
      error: 'Mật khẩu mới phải có ít nhất 8 ký tự.',
    };
  }

  // Set new password
  const newHash = await hashPassword(newPassword);
  localStorage.setItem(AUTH_KEYS.PASSWORD_HASH, newHash);

  return { success: true };
}

/**
 * Get session info
 */
export function getSessionInfo(): {
  expiresIn: number; // minutes
  expiresAt: string;
} | null {
  const expiry = localStorage.getItem(AUTH_KEYS.SESSION_EXPIRY);
  
  if (!expiry) {
    return null;
  }

  const expiryTime = parseInt(expiry);
  const now = Date.now();
  const remaining = expiryTime - now;

  if (remaining <= 0) {
    return null;
  }

  return {
    expiresIn: Math.ceil(remaining / 1000 / 60),
    expiresAt: new Date(expiryTime).toLocaleString('vi-VN'),
  };
}
