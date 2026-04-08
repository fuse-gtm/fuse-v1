import { CronRegisterAllCommand } from 'src/database/commands/cron-register-all.command';

type MockCronCommand = {
  run: jest.Mock<Promise<void>, []>;
};

const createMockCronCommand = (
  implementation?: () => Promise<void>,
): MockCronCommand => ({
  run: jest.fn(implementation ?? (async () => {})),
});

const createCommand = (commands: MockCronCommand[]) =>
  new CronRegisterAllCommand(
    commands[0] as never,
    commands[1] as never,
    commands[2] as never,
    commands[3] as never,
    commands[4] as never,
    commands[5] as never,
    commands[6] as never,
    commands[7] as never,
    commands[8] as never,
    commands[9] as never,
    commands[10] as never,
    commands[11] as never,
    commands[12] as never,
    commands[13] as never,
    commands[14] as never,
    commands[15] as never,
    commands[16] as never,
    commands[17] as never,
    commands[18] as never,
    commands[19] as never,
    commands[20] as never,
    commands[21] as never,
    commands[22] as never,
    commands[23] as never,
  );

describe('CronRegisterAllCommand', () => {
  const originalTimeout = process.env.CRON_REGISTER_COMMAND_TIMEOUT_MS;

  beforeEach(() => {
    jest.useRealTimers();
    delete process.env.CRON_REGISTER_COMMAND_TIMEOUT_MS;
  });

  afterAll(() => {
    if (originalTimeout === undefined) {
      delete process.env.CRON_REGISTER_COMMAND_TIMEOUT_MS;
      return;
    }
    process.env.CRON_REGISTER_COMMAND_TIMEOUT_MS = originalTimeout;
  });

  it('should register every cron command when all commands resolve', async () => {
    const commands = Array.from({ length: 24 }, () => createMockCronCommand());
    const command = createCommand(commands);

    await expect(command.run()).resolves.toBeUndefined();

    for (const cmd of commands) {
      expect(cmd.run).toHaveBeenCalledTimes(1);
    }
  });

  it('should continue registering remaining commands when one command times out', async () => {
    process.env.CRON_REGISTER_COMMAND_TIMEOUT_MS = '10';

    const hangingCommand = createMockCronCommand(
      () => new Promise<void>(() => {}),
    );
    const followingCommand = createMockCronCommand();
    const commands = [
      hangingCommand,
      followingCommand,
      ...Array.from({ length: 22 }, () => createMockCronCommand()),
    ];

    const command = createCommand(commands);

    await expect(command.run()).resolves.toBeUndefined();

    expect(hangingCommand.run).toHaveBeenCalledTimes(1);
    expect(followingCommand.run).toHaveBeenCalledTimes(1);
  });
});
