// Tests unitaires
import { testUser } from "src/users/tests/user-seeds";
import { InMemoryWebinarRepository } from "../adapters/webinar-repository.in-memory";
import { ChangeSeats } from "./change-seats";
import { Webinar } from "../entities/webinar.entity";
import { WebinarNotFoundException } from "../exceptions/webinar-not-found";

describe('Feature : Change seats', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;

  const webinar = new Webinar({
      id: 'webinar-id',
      organizerId: testUser.alice.props.id,
      title: 'Webinar title',
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-01-01T01:00:00Z'),
      seats: 100,
  });

  beforeEach(() => {
      webinarRepository = new InMemoryWebinarRepository([webinar]);
      useCase = new ChangeSeats(webinarRepository);
  });
  const payload = {
    user: testUser.alice,
    webinarId: 'webinar-id',
    seats: 200,
  };
  // Initialisation de nos tests, boilerplates...
  describe('Scenario: Happy path', () => {
    // Code commun à notre scénario : payload...
    it('should change the number of seats for a webinar', async () => {
      // ACT
  await useCase.execute(payload);
  // ASSERT
  const updatedWebinar = await webinarRepository.findById('webinar-id');
  thenUpdatedWebinarSeatsShouldBe(200)
    });
  });

  function expectWebinarToRemainUnchanged() {
    const webinar = webinarRepository.findByIdSync('webinar-id');
    expect(webinar?.props.seats).toEqual(100);
  }

  function whenUserChangeSeatsWith(useCase: ChangeSeats,payload:any) {
    return expect(useCase.execute(payload))
  }

  async function thenUpdatedWebinarSeatsShouldBe(number:Number){
    const updatedWebinar = await webinarRepository.findById('webinar-id');
    expect(updatedWebinar?.props.seats).toEqual(number);
  }

  describe('Scenario: webinar does not exist', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'false-id',
      seats: 200,
    };
    it('should fail', async () => {
      expectWebinarToRemainUnchanged()
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinar not found',
      );
    });
});

      describe('Scenario: webinar does not exist', () => {
        const payload = {
        user: testUser.bob,
          webinarId: 'webinar-id',
          seats: 200,
      };
      it('should fail', async () => {
        await expect(useCase.execute(payload)).rejects.toThrow(
          'User is not allowed to update this webinar',
        );
      });
      });

      describe('Scenario: change set to lower number', () => {
        const payload = {
        user: testUser.alice,
          webinarId: 'webinar-id',
          seats: 70,
      };
      it('should fail', async () => {  
        expectWebinarToRemainUnchanged()
        await whenUserChangeSeatsWith(useCase,payload).rejects.toThrow(
          'You cannot reduce the number of seats',
        );
      });
      });

      describe('Scenario: change set to many seats', () => {
        const payload = {
        user: testUser.alice,
          webinarId: 'webinar-id',
          seats: 1001,
      };
      it('should fail', async () => {  
        expectWebinarToRemainUnchanged()
        await whenUserChangeSeatsWith(useCase,payload).rejects.toThrow(
          'Webinar must have at most 1000 seats',
        );
      });
      });


      });